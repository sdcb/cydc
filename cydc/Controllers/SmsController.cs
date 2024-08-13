using cydc.Controllers.SmsDtos;
using cydc.Database;
using cydc.Managers.Identities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using qcloudsms_csharp;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace cydc.Controllers;

[Authorize(Roles = "Admin")]
public class SmsController(
    IOptions<TencentSmsConfig> smsOptions,
    IOptions<TencentSmsTemplateConfig> smsTemplateOptions,
    CydcContext db) : Controller
{
    TencentSmsConfig _smsConfig = smsOptions.Value;
    TencentSmsTemplateConfig _smsTemplateConfig = smsTemplateOptions.Value;
    CydcContext _db = db;

    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Remind(int toUserId)
    {
        var user = await _db.Users
            .Where(x => x.Id == toUserId)
            .Select(x => new
            {
                UserId = x.Id,
                UserName = x.UserName,
                Phone = x.PhoneNumber,
                Balance = x.AccountDetails.Sum(v => v.Amount),
                HasToday = x.SmsSendLogReceiveUser.Any(v => v.SendTime > DateTime.Now.Date), 
            })
            .FirstOrDefaultAsync();

        if (user == null) return BadRequest("用户不存在。");
        if (string.IsNullOrWhiteSpace(user.Phone)) return BadRequest($"用户电话不存在或格式不对: {user.Phone}。");
        if (user.Balance >= 0) return BadRequest($"用户账户余额必须大于0: {user.Balance}。");
        if (user.HasToday) return BadRequest($"一天只能给用户催一次帐。");

        string[] parameters = new[] { user.UserName, (-user.Balance).ToString("N2") };

        SmsSendLog smsSendLog = new()
        {
            OperationUserId = int.Parse(User.GetUserId()), 
            ReceiveUserId = toUserId, 
            SendTime = DateTime.Now, 
            TemplateId = _smsTemplateConfig.RemindTemplateId, 
            ReceiveUserPhone = user.Phone, 
            Parameter = JsonConvert.SerializeObject(parameters), 
        };
        _db.SmsSendLog.Add(smsSendLog);
        await _db.SaveChangesAsync();

        SmsSingleSender client = new(_smsConfig.AppId, _smsConfig.AppKey);
        SmsSingleSenderResult result = client.sendWithParam("86", user.Phone, 
            templateId: _smsTemplateConfig.RemindTemplateId, 
            parameters: parameters, 
            sign: _smsTemplateConfig.Sign, 
            extend:"", ext:"");

        smsSendLog.SmsSendResult = new SmsSendResult
        {
            ErrorMessage = result.errMsg, 
            ExtensionMessage = result.ext, 
            ErrorCode = result.result, 
            Fee = (byte)result.fee, 
            Sid = result.sid, 
        };
        await _db.SaveChangesAsync();

        return result.result switch
        {
            0 => Ok(), 
            _ => BadRequest(result.errMsg), 
        };
    }
}

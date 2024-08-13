using System.Threading.Tasks;
using cydc.Controllers.AdmimDtos;
using cydc.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QRCoder;

namespace cydc.Controllers;

[Authorize]
public class QrCodeController : Controller
{
    [AllowAnonymous]
    public IActionResult Dev()
    {
        string id = "https://u.wechat.com/MFDpcGQFjwnH0udlvS1nm0w";
        byte[] qrImageData = GetQRImage(id);
        return File(qrImageData, "image/png");
    }

    public IActionResult Pay()
    {
        string id = "HTTPS://QR.ALIPAY.COM/LPX06836V926QKAB6FAR64";
        byte[] qrImageData = GetQRImage(id);
        return File(qrImageData, "image/png");
    }

    public IActionResult RedPacket()
    {
        string id = "lX6zc1x09185qbi6ezowgav9l67urb";
        byte[] qrImageData = GetQRImage(id);
        return File(qrImageData, "image/png");
    }

    private byte[] GetQRImage(string content)
    {
        using (var qrCodeGenerator = new QRCodeGenerator())
        using (QRCodeData data = qrCodeGenerator.CreateQrCode(content, QRCodeGenerator.ECCLevel.L))
        using (var qrCode = new PngByteQRCode(data))
        {
            return qrCode.GetGraphic(4);
        }
    }
}
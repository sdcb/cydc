using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;

namespace cydc.Controllers
{
    public class SmsController : Controller
    {
        private readonly ILogger _logger;

        public SmsController(ILogger<SmsController> logger)
        {
            _logger = logger;
        }

        [HttpPost, Route("/api/sms/on-message")]
        public IActionResult OnMessage([FromBody] SmsResponseDto dto)
        {
            _logger.LogInformation(new EventId(1, "on-message-header"), JsonConvert.SerializeObject(Request.Headers));
            _logger.LogInformation(new EventId(2, "on-message-body"), ReadString(Request.Body));
            _logger.LogInformation(new EventId(3, "on-message-dto"), JsonConvert.SerializeObject(dto));
            return Ok(dto);

            string ReadString(Stream stream)
            {
                using (var reader = new StreamReader(stream))
                {
                    return reader.ReadToEnd();
                }
            }
        }
    }

    public class SmsResponseDto
    {
        public string Extend { get; set; }
        public string Mobile { get; set; }
        public string NationCode { get; set; }
        public string Sign { get; set; }
        public string Text { get; set; }
        public int Time { get; set; }
    }
}
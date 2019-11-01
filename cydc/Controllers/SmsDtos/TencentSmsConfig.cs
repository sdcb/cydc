using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cydc.Controllers.SmsDtos
{
    public class TencentSmsConfig
    {
        public int AppId { get; set; }

        public string AppKey { get; set; }
    }

    public class TencentSmsTemplateConfig
    {
        public string Sign { get; set; }

        public int RemindTemplateId { get; set; } // {1} 您好，您的点餐网站帐下有{2}元未结账，请尽早付清哦。	
    }
}

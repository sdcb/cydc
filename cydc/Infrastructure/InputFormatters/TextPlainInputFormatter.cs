using cydc.Infrastructure.InputFormats;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Text;
using System.Threading.Tasks;

namespace cydc.Infrastructure.InputFormats
{
    public class TextPlainInputFormatter : TextInputFormatter
    {
        public TextPlainInputFormatter()
        {
            SupportedMediaTypes.Add("text/plain");
            SupportedEncodings.Add(UTF8EncodingWithoutBOM);
            SupportedEncodings.Add(UTF16EncodingLittleEndian);
        }

        protected override bool CanReadType(Type type)
        {
            return type == typeof(string);
        }

        public override async Task<InputFormatterResult> ReadRequestBodyAsync(InputFormatterContext context, Encoding encoding)
        {
            string data = null;
            using (var streamReader = context.ReaderFactory(context.HttpContext.Request.Body, encoding))
            {
                data = await streamReader.ReadToEndAsync();
            }
            return InputFormatterResult.Success(data);
        }
    }
}

namespace Microsoft.Extensions.DependencyInjection
{
    public static class TextPlainInputFormatterExtensions
    {
        public static IMvcBuilder AddTextPlainInput(this IMvcBuilder mvcBuilder)
        {
            return mvcBuilder.AddMvcOptions(o =>
            {
                o.InputFormatters.Add(new TextPlainInputFormatter());
            });
        }
    }
}

using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace cydc.Hubs
{
    public class NewOrderHub : Hub<NewOrderHubClient>
    {
    }

    public static class NewOrderHubExtensions
    {
        public static async Task OnNewOrder(this IHubContext<NewOrderHub, NewOrderHubClient> hubContext, int orderId)
        {
            await hubContext.Clients.All.OnNewOrder(orderId);
        }
    }

    public interface NewOrderHubClient
    {
        Task OnNewOrder(int orderId);
    }
}

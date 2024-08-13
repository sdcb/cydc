using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace cydc.Hubs;

public class NewOrderHub : Hub<NewOrderHubClient>
{
}

public static class NewOrderHubExtensions
{
    public static async Task OnNewOrder(this IHubContext<NewOrderHub, NewOrderHubClient> hubContext, int foodOrderId)
    {
        await hubContext.Clients.All.OnNewOrder(foodOrderId);
    }
}

public interface NewOrderHubClient
{
    Task OnNewOrder(int foodOrderId);
}

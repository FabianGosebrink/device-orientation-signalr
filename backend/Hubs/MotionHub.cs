using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

public class MotionHub : Hub
{
    public async Task MySuperDuperAction(MotionDto data)
    {
        await Clients.Caller.SendAsync("motionUpdated", data);
    }
}
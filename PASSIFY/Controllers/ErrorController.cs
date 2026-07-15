using Microsoft.AspNetCore.Mvc;

namespace PASSIFY.Controllers;

public class ErrorController : Controller
{
    [Route("Error/Status/{statusCode}")]
    public IActionResult Status(int statusCode)
    {
        if (statusCode is < 400 or > 599)
        {
            return RedirectToAction(nameof(Status), new { statusCode = 404 });
        }
        return View(statusCode);
    }
}
using Microsoft.AspNetCore.Mvc;
using PASSIFY.Lib;
namespace PASSIFY.Models;

public class NavItem
{
    private string _icon = string.Empty;

    public string Controller { get; set; } = string.Empty;

    public string Action { get; set; } = string.Empty;

    public string Text { get; set; } = string.Empty;

    public string Icon
    {
        get => Helpers.SvgPath(_icon);
        set => _icon = value;
    }
}
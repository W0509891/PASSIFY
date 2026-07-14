namespace PASSIFY.Models;

public class TableColumn<T>
{
    public string Header { get; set; } = "";
    public Func<T, object> Value { get; set; }
}

public class TableViewModel<T>
{
    public IEnumerable<T> Items { get; set; } = [];
    public List<TableColumn<T>> Columns { get; set; } = [];
    public Func<T, object> Id { get; set; }
    
    public bool ShowActions { get; set; }
    
}
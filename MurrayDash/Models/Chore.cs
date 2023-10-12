using System;
using System.Collections.Generic;

namespace MurrayDash.Models;

public partial class Chore
{
    public int Id { get; set; }

    public string Description { get; set; } = null!;

    public string Abbrev { get; set; } = null!;

    public int HourValue { get; set; }

    public int IdOwner { get; set; }

    public double ExpectedValuePerDay { get; set; }

    public string? Detail { get; set; }

    public string? Purpose { get; set; }

    public virtual ICollection<ChoreActivity> ChoreActivities { get; set; } = new List<ChoreActivity>();

    public virtual Person IdOwnerNavigation { get; set; } = null!;
}

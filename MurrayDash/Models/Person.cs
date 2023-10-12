using System;
using System.Collections.Generic;

namespace MurrayDash.Models;

public partial class Person
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<ChoreActivity> ChoreActivities { get; set; } = new List<ChoreActivity>();

    public virtual ICollection<Chore> Chores { get; set; } = new List<Chore>();
}

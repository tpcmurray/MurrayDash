using System;
using System.Collections.Generic;

namespace MurrayDash.Models;

public partial class ChoreActivity
{
    public int Id { get; set; }

    public int IdName { get; set; }

    public int IdChore { get; set; }

    public DateTime DateChore { get; set; }

    public virtual Chore IdChoreNavigation { get; set; } = null!;

    public virtual Person IdNameNavigation { get; set; } = null!;
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MurrayDash.Models;

namespace MurrayDash.Controllers
{
    public class Chores
    {
        public static IEnumerable<ChoreActivityFull> GetChoreActivitiesByNameId(MurrayDashContext context, int nameId)
        {
            var choreActivities = context.ChoreActivities
                .Select(x => new ChoreActivityFull()
                {
                    Id = x.Id,
                    IdName = x.IdName,
                    Owner = x.IdNameNavigation.Name,
                    IdChore = x.IdChore,
                    ChoreDescription = x.IdChoreNavigation.Description,
                    ChorePoints = x.IdChoreNavigation.HourValue,
                    DateChore = x.DateChore
                })
                .Where(x => x.IdName == nameId)
                .ToList();

            return choreActivities;
        }

        public static ChoreCalcs GetChoreCalcs(MurrayDashContext context)
        {
            return context.ChoreCalc.First();
        }
    }
    public class ChoreActivityFull
    {
        public int Id { get; set; }

        public int IdName { get; set; }

        public String? Owner { get; set; }

        public int IdChore { get; set; }

        public String? ChoreDescription { get; set; }

        public int ChorePoints { get; set; }

        public DateTime DateChore { get; set; }
    }
}

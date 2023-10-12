using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MurrayDash.Models
{
    public partial class ChoreCalcs
    {
        public int Id { get; set; }
        public int TotalPoints { get; set; }
        public int PercentComplete { get; set; }
        public int DailyAverage { get; set; }
        public int DailyAvgNeeded { get; set; }
        public int DaysAtCurrentRate { get; set; }
        public bool IsWinning { get; set; }
        public DateTime DateTo11k { get; set; }
        public int AddisonTotal { get; set; }
        public int SkylarTotal { get; set; }
    }
}

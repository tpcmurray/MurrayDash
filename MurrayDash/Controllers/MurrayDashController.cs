using Microsoft.AspNetCore.Mvc;
using MurrayDash.Models;

namespace MurrayDash.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MurrayDashController : ControllerBase
    {
        private readonly MurrayDashContext _dbContext;

        public MurrayDashController(MurrayDashContext dbContext)
        {
            _dbContext = dbContext; 
        }

        [HttpGet]
        [Route("GetChoreActivitiesByNameId")]
        public IEnumerable<ChoreActivityFull> GetChoreActivitiesByNameId(int nameId)
        {
            return Chores.GetChoreActivitiesByNameId(_dbContext, nameId);
        }

        [HttpGet]
        [Route("GetChoreCalcs")]
        public ChoreCalcs GetChoreCalcs()
        {
            return Chores.GetChoreCalcs(_dbContext);
        }

        [HttpGet]
        [Route("GetEvents")]
        public IEnumerable<TEvent> GetEvents()
        {
            var events = GoogleCalendar.GetEventsByCalendar("tpcmurray@gmail.com", 20);
            events.AddRange(GoogleCalendar.GetEventsByCalendar("nicolelanamurray@gmail.com", 20));
            events.AddRange(GoogleCalendar.GetEventsByCalendar("addisonnicolemurray@gmail.com", 20));
            events.AddRange(GoogleCalendar.GetEventsByCalendar("skylarterimurray@gmail.com", 20));

            return events;
        }
    }
}

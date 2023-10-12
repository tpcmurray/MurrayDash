using Microsoft.VisualStudio.TestTools.UnitTesting;
using MurrayDash.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MurrayDash.Controllers.Tests
{
    [TestClass()]
    public class GoogleCalendarTests
    {
        [TestMethod()]
        public void GetEventsByCalendarTest()
        {
            var events = GoogleCalendar.GetEventsByCalendar("tpcmurray@gmail.com", 8);
            events.AddRange(GoogleCalendar.GetEventsByCalendar("nicolelanamurray@gmail.com", 8));
            events.AddRange(GoogleCalendar.GetEventsByCalendar("addisonnicolemurray@gmail.com", 8));
            events.AddRange(GoogleCalendar.GetEventsByCalendar("skylarterimurray@gmail.com", 8));
            
            Assert.Fail();
        }
    }
}
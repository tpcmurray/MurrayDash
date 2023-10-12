using Google.Apis.Calendar.v3;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Calendar.v3.Data;
using System.Diagnostics;
using System.Globalization;

namespace MurrayDash.Controllers
{
    public class GoogleCalendar
    {
        public static List<TEvent> GetEventsByCalendar(string calendarId, int maxResults)
        {
            string jsonFile = "xxxx.json";
            string[] Scopes = { CalendarService.Scope.Calendar };
            ServiceAccountCredential credential;

            using (var stream =
                new FileStream(jsonFile, FileMode.Open, FileAccess.Read))
            {
                var confg = Google.Apis.Json.NewtonsoftJsonSerializer.Instance.Deserialize<JsonCredentialParameters>(stream);
                credential = new ServiceAccountCredential(
                   new ServiceAccountCredential.Initializer(confg.ClientEmail)
                   {
                       Scopes = Scopes
                   }.FromPrivateKey(confg.PrivateKey));
            }

            var service = new CalendarService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = "MurrayDash",
            });

            var calendar = service.Calendars.Get(calendarId).Execute();

            EventsResource.ListRequest listRequest = service.Events.List(calendarId);
            listRequest.TimeMin = DateTime.Now;
            listRequest.ShowDeleted = false;
            listRequest.SingleEvents = true;
            listRequest.MaxResults = maxResults;
            listRequest.TimeMax = DateTime.Now.AddDays(1);
            listRequest.OrderBy = EventsResource.ListRequest.OrderByEnum.StartTime;

            Events events = listRequest.Execute();
            var calEvents = events.Items
                .Select(x => new TEvent(calendarId,
                    x.Id,
                    x.Summary,
                    x.Description,
                    x.Start.Date,
                    x.End.Date,
                    x.Start.DateTime,
                    x.End.DateTime
                    )).ToList();

            return calEvents;
        }
    }

    [DebuggerDisplay("{CalendarId} {Summary} ({StartDateString}, {StartTimeString} to {EndTimeString})")]
    public class TEvent
    {
        public static CultureInfo culture = CultureInfo.CurrentCulture;


        public TEvent(
            string calId, 
            string eventId,
            string summary,
            string desc,
            string startDate,
            string endDate,
            DateTime? startDateTime,
            DateTime? endDateTime
            )
        {
            CalendarId = calId;
            EventId = eventId;
            Summary = summary;
            Description = desc;

            if (startDateTime.HasValue)
                Start = startDateTime.Value;
            else
                Start = DateTime.ParseExact(startDate, "yyyy-mm-dd", culture);

            if (endDateTime.HasValue)
                End = endDateTime.Value;
            else
                End = DateTime.ParseExact(endDate, "yyyy-mm-dd", culture);
        }

        public string CalendarId { get; internal set; }
        public string EventId { get; internal set; }
        public string Summary { get; internal set; }
        public string Description { get; internal set; }
        public DateTime Start { get; internal set; }
        public DateTime End { get; internal set; }

        public string StartDateString
        {
            get { return Start.ToString("dddd, MMMM dd"); }
        }

        public string EndDateString
        {
            get { return Start.ToString("dddd, MMMM dd"); }
        }

        public string StartTimeString
        {
            get { return Start.ToShortTimeString(); }
        }

        public string EndTimeString
        {
            get { return End.ToShortTimeString(); }
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Services
{
    public class SquarePaymentApiOptions
    {
        public Square.Environment Environment { get; set; }
        public string LocationId { get; set; }
        public string ApplicationId { get; set; }
        public string AccessToken { get; set; }
        public string Currency { get; set; }
    }
}

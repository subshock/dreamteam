using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Services
{
    public class SquarePaymentService : IPaymentService
    {
        private readonly Square.ISquareClient _client;
        private readonly ILogger _logger;
        private readonly SquarePaymentApiOptions _options;

        private string PaymentSuccessCode = "COMPLETED";

        public SquarePaymentService(Square.ISquareClient client, ILogger<SquarePaymentService> logger, IOptionsSnapshot<SquarePaymentApiOptions> options)
        {
            _client = client;
            _logger = logger;
            _options = options.Value;
        }

        public async Task<PaymentResponse> Payment(decimal costPerItem, int quantity, string token, string verificationToken, string emailAddress)
        {
            var payment = new Square.Models.CreatePaymentRequest.Builder(token, Guid.NewGuid().ToString("N"),
                new Square.Models.Money.Builder().Amount(quantity * Convert.ToInt64(costPerItem * 100)).Currency(_options.Currency).Build())
                .Autocomplete(true)
                .LocationId(this._options.LocationId)
                .Note($"DreamTeam x {quantity}")
                .StatementDescriptionIdentifier("DRAGONDREAMTEAM")
                .BuyerEmailAddress(emailAddress)
                .VerificationToken(verificationToken)
                .Build();


            try
            {
                var result = await _client.PaymentsApi.CreatePaymentAsync(payment);

                return new PaymentResponse
                {
                    Succeeded = result.Context.Response.StatusCode == 200 && result.Payment.Status.SeCi(PaymentSuccessCode),
                    Response = result
                };

            }
            catch (Square.Exceptions.ApiException ex)
            {
                _logger.LogError(ex, "Error sending payment to Square");
                return new PaymentResponse
                {
                    Succeeded = false,
                    Exception = ex
                };
            }
        }
    }

    public class PaymentResponse
    {
        public bool Succeeded { get; set; }
        public Square.Models.CreatePaymentResponse Response { get; set; }
        public Square.Exceptions.ApiException Exception { get; set; }
    }

    public class SquareClientFactory
    {
        public readonly IOptions<SquarePaymentApiOptions> _options;
        public SquareClientFactory(IOptions<SquarePaymentApiOptions> options)
        {
            _options = options;
        }

        public Square.ISquareClient BuildClient()
        {
            var opts = _options.Value;

            return new Square.SquareClient.Builder()
                .Environment(opts.Environment)
                .AccessToken(opts.AccessToken)
                .Build();
        }
    }
}

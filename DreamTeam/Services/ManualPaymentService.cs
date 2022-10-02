using System.Threading.Tasks;

namespace DreamTeam.Services
{
    public class ManualPaymentService : IPaymentService
    {
        public Task<PaymentResponse> Payment(decimal costPerItem, int quantity, string token, string verificationToken, string emailAddress)
        {
            return Task.FromResult(new PaymentResponse
            {
                Succeeded = true,
                Response = null,
                Exception = null
            });
        }
    }
}

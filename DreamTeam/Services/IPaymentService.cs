using System.Threading.Tasks;

namespace DreamTeam.Services
{
    public interface IPaymentService
    {
        Task<PaymentResponse> Payment(decimal costPerItem, int quantity, string token, string verificationToken, string emailAddress);
    }
}
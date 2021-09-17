using DreamTeam.Models;
using DreamTeam.Services;
using System;
using System.Text.Json;
using System.Threading.Tasks;

namespace DreamTeam.Data
{
    public partial class ApplicationDbContext
    {
        public Task LogPayment(PaymentResponse response)
        {
            var payment = new Payment
            {
                Id = Guid.NewGuid(),
                TokenId = response.Response?.Payment?.Id,
                Success = response.Succeeded,
                Created = DateTime.UtcNow,
                PaymentDetails = response.Exception != null 
                    ? JsonSerializer.Serialize(response.Exception.Data)
                    : JsonSerializer.Serialize(response.Response.Payment)
            };

            Payments.Add(payment);

            return SaveChangesAsync();
        }
    }
}

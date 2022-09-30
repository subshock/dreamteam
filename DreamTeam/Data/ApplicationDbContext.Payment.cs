using Dapper;
using DreamTeam.Areas.Api.Admin.ViewModels;
using DreamTeam.Models;
using DreamTeam.Services;
using System;
using System.Collections.Generic;
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
                    : JsonSerializer.Serialize(response.Response?.Payment)
            };

            Payments.Add(payment);

            return SaveChangesAsync();
        }

        public Task<IEnumerable<PaymentSummaryViewModel>> SearchPayments(PaymentSearchModel model)
        {
            return Connection.QueryAsync<PaymentSummaryViewModel>("SELECT P.Id, P.TokenId, P.Success, P.Created " +
                "FROM Payments AS P " +
                "WHERE(@From Is Null OR P.Created >= @From) " +
                "    AND(@To Is Null OR P.Created < DATEADD(day, 1, @To)) " +
                "    AND(@Token Is Null OR P.TokenId LIKE '%' + @Token + '%') " +
                "    AND(@Status = 0 OR(@Status = 1 AND P.Success = 1) OR(@Status = 2 AND P.Success = 0)) " +
                "ORDER BY P.Created ASC", model);
        }

        public Task<PaymentDetailViewModel> GetPayment(Guid id)
        {
            return Connection.QueryFirstOrDefaultAsync<PaymentDetailViewModel>("SELECT Id, TokenId, Success, Created, PaymentDetails " +
                "FROM Payments AS P " +
                "WHERE P.Id=@id", new { id });
        }
    }
}

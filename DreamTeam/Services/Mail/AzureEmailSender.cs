using Azure;
using Azure.Communication.Email;
using Azure.Communication.Email.Models;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DreamTeam.Services.Mail
{
    public class AzureEmailSenderOptions
    {
        public string ConnectionString { get; set; }
        public List<string> Bcc { get; set; }
        public string FromAddress { get; set; }
        public string FromName { get; set; }
    }

    public class AzureEmailSender : IEmailSender
    {
        private readonly AzureEmailSenderOptions _options;
        private readonly ILogger _logger;

        public AzureEmailSender(IOptions<AzureEmailSenderOptions> options, ILogger<AzureEmailSender> logger)
        {
            _options = options.Value;
            _logger = logger;
        }

        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            if (string.IsNullOrEmpty(_options.ConnectionString))
            {
                _logger.LogWarning("No Azure Email connection string is set");
                return;
            }

            var client = new EmailClient(_options.ConnectionString);
            var content = new EmailContent(subject);
            content.Html = htmlMessage;
            var recipients = new EmailRecipients(new[] { new EmailAddress(email) });
            if (_options.Bcc != null)
                foreach (var bcc in _options.Bcc)
                    recipients.BCC.Add(new EmailAddress(bcc));
            var message = new EmailMessage(_options.FromAddress, content, recipients);

            try
            {
                var result = await client.SendAsync(message);
                _logger.LogInformation($"Email '{subject}' to '{email}' sent, message id: {result.Value.MessageId}");
            }
            catch (RequestFailedException ex)
            {
                _logger.LogError(ex, $"Error sending email '{subject}' to '{email}");
            }
        }
    }
}

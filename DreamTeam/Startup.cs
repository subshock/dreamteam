using Dapper;
using DreamTeam.Data;
using DreamTeam.Models;
using DreamTeam.Services;
using DreamTeam.Services.Auth;
using DreamTeam.Services.Mail;
using DreamTeam.Services.TypeHandlers;
using Hangfire;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DreamTeam
{
    public class Startup
    {
        private readonly IWebHostEnvironment _env;

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            _env = env;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    Configuration.GetConnectionString("DefaultConnection")));

            services.AddDataProtection()
                .PersistKeysToDbContext<ApplicationDbContext>();

            services.AddHangfire(configuration => configuration
                .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UseSqlServerStorage(Configuration.GetConnectionString("DefaultConnection"), new Hangfire.SqlServer.SqlServerStorageOptions
                {
                    CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
                    SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
                    QueuePollInterval = TimeSpan.Zero,
                    UseRecommendedIsolationLevel = true,
                    DisableGlobalLocks = true
                })
            );

            services.AddHangfireServer();

            services.AddDatabaseDeveloperPageExceptionFilter();

            services.AddDefaultIdentity<ApplicationUser>(options =>
            {
                options.SignIn.RequireConfirmedAccount = false;
                options.SignIn.RequireConfirmedEmail = false;
            })
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>();

            var identityServerBuilder = services.AddIdentityServer(options =>
            {
                var issuer = Configuration["Authentication:IssuerUri"];
                if (_env.IsEnvironment("Production") && !string.IsNullOrEmpty(issuer))
                    options.IssuerUri = issuer;
            })
                .AddApiAuthorization<ApplicationUser, ApplicationDbContext>()
                .AddProfileService<AuthProfileService>();

            services.AddAuthentication()
                //.AddGoogle(options =>
                //{
                //    var googleAuthNSection = Configuration.GetSection("Authentication:Google");
                //    options.ClientId = googleAuthNSection["ClientId"];
                //    options.ClientSecret = googleAuthNSection["ClientSecret"];
                //})
                //.AddFacebook(options =>
                //{
                //    var facebookAuthNSection = Configuration.GetSection("Authentication:Facebook");
                //    options.AppId = facebookAuthNSection["AppId"];
                //    options.AppSecret = facebookAuthNSection["AppSecret"];
                //})
                .AddIdentityServerJwt();

            services.AddTransient<IEmailSender, SendGridEmailSender>();
            services.Configure<AuthMessageSenderOptions>(Configuration);

            services.AddControllersWithViews();
            services.AddRazorPages();

            services.AddAuthorization(options =>
            {
                options.AddPolicy("Administrator", policy => policy
                    .RequireAuthenticatedUser()
                    .RequireClaim(ClaimTypes.Role, "Administrator"));
            });

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });

            services.AddScoped<TeamManagementService>();
            services.AddScoped<TaskLogService>();
            services.AddScoped<RoundCompletedBackgroundTask>();
            services.AddScoped<SquarePaymentService>();

            services.Configure<SquarePaymentApiOptions>(Configuration.GetSection("Square"));
            services.AddSingleton<SquareClientFactory>();
            services.AddScoped(provider => provider.GetRequiredService<SquareClientFactory>().BuildClient());

            SqlMapper.AddTypeHandler(new JsonDocumentTypeHandler());
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider serviceProvider)
        {
            CreateRoles(serviceProvider).Wait();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseMigrationsEndPoint();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseRouting();

            app.UseAuthentication();
            app.UseIdentityServer();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHangfireDashboard();
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                endpoints.MapRazorPages();
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }

        private async Task CreateRoles(IServiceProvider serviceProvider)
        {
            var roleMgr = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userMgr = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            if (!await roleMgr.RoleExistsAsync("Administrator"))
            {
                await roleMgr.CreateAsync(new IdentityRole("Administrator"));
            }

            if (!await roleMgr.RoleExistsAsync("SysAdmin"))
            {
                await roleMgr.CreateAsync(new IdentityRole("SysAdmin"));
            }

            var user = await userMgr.FindByEmailAsync("mlmcdonnell@gmail.com");

            if (user != null)
            {
                var roles = await userMgr.GetRolesAsync(user);

                if (!await userMgr.IsInRoleAsync(user, "Administrator"))
                    await userMgr.AddToRoleAsync(user, "Administrator");

                if (!await userMgr.IsInRoleAsync(user, "SysAdmin"))
                    await userMgr.AddToRoleAsync(user, "SysAdmin");
            }
        }
    }
}

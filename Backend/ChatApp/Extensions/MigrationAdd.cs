using System.Diagnostics;
using ChatApp.Data;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Extensions
{
    public static class MigrationAdd
    {
        public static async Task ApplyMigrationsAsync(this IServiceProvider serviceProvider)
        {
            try
            {
                using var scope = serviceProvider.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var migrationsTableExists = await db.Database
                    .ExecuteSqlRawAsync("SELECT 1 FROM pg_tables WHERE tablename = '__efmigrationshistory'");
                if (migrationsTableExists != 0)
                {
                    var pendingMigrations = await db.Database.GetPendingMigrationsAsync();
                    if (pendingMigrations.Any())
                    {
                        await db.Database.MigrateAsync();
                    }
                }
            }
            catch
            {
                Debug.WriteLine("Acontece ne, cai no catch");
            }
        }
    }
}
using System.Security.Cryptography;
using System.Text;

namespace EnergyHub.API.Services.Auth;

public class PasswordHasher
{
    // PBKDF2 com SHA256. Para produção, ajuste iterações e política de senha.
    private const int SaltSizeBytes = 16;
    private const int HashSizeBytes = 32;
    private const int Iterations = 100_000;

    public (string HashBase64, string SaltBase64) HashPassword(string password)
    {
        var saltBytes = RandomNumberGenerator.GetBytes(SaltSizeBytes);
        var hashBytes = DeriveKey(password, saltBytes);

        return (Convert.ToBase64String(hashBytes), Convert.ToBase64String(saltBytes));
    }

    public bool VerifyPassword(string password, string saltBase64, string hashBase64)
    {
        var saltBytes = Convert.FromBase64String(saltBase64);
        var expectedHashBytes = Convert.FromBase64String(hashBase64);
        var actualHashBytes = DeriveKey(password, saltBytes);

        return CryptographicOperations.FixedTimeEquals(actualHashBytes, expectedHashBytes);
    }

    private static byte[] DeriveKey(string password, byte[] saltBytes)
    {
        var passwordBytes = Encoding.UTF8.GetBytes(password);
        using var pbkdf2 = new Rfc2898DeriveBytes(passwordBytes, saltBytes, Iterations, HashAlgorithmName.SHA256);
        return pbkdf2.GetBytes(HashSizeBytes);
    }
}


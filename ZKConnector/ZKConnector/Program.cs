using System;
using zkemkeeper;
using System.Net.Http;
using System.Text;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.IO;
using System.Net.NetworkInformation;
using Newtonsoft.Json.Linq;

class Program
{
    static async Task Main(string[] args)
    {
        // 🔹 Leer config.json
        var config = JObject.Parse(File.ReadAllText("config.json"));
        string deviceIp = config["device_ip"].ToString();
        int devicePort = (int)config["device_port"];
        string backendUrl = config["backend_url"].ToString();

        await ReenviarRegistrosOffline(backendUrl);

        if (!IsDeviceReachable(deviceIp))
        {
            Console.WriteLine($"❌ No se detecta el dispositivo en red local ({deviceIp}).");
            return;
        }

        CZKEM zkem = new CZKEM();
        int machineNumber = 1;

        if (zkem.Connect_Net(deviceIp, devicePort))
        {
            Console.WriteLine($"✅ Conectado al dispositivo ZKTeco ({deviceIp}:{devicePort})");

            if (zkem.ReadGeneralLogData(machineNumber))
            {
                Console.WriteLine("📥 Leyendo registros...");

                string dwEnrollNumber;
                int dwVerifyMode, dwInOutMode, dwYear, dwMonth, dwDay, dwHour, dwMinute, dwSecond, dwWorkCode = 0;
                var registros = new List<object>();

                while (zkem.SSR_GetGeneralLogData(
                    machineNumber,
                    out dwEnrollNumber,
                    out dwVerifyMode,
                    out dwInOutMode,
                    out dwYear,
                    out dwMonth,
                    out dwDay,
                    out dwHour,
                    out dwMinute,
                    out dwSecond,
                    ref dwWorkCode))
                {
                    string timestamp = new DateTime(dwYear, dwMonth, dwDay, dwHour, dwMinute, dwSecond)
                        .ToString("yyyy-MM-dd HH:mm:ss");

                    Console.WriteLine($"➡️ Usuario: {dwEnrollNumber} | Fecha: {timestamp} | Tipo: {dwInOutMode}");

                    registros.Add(new
                    {
                        user_id = dwEnrollNumber,
                        timestamp,
                        status = dwInOutMode == 0 ? "entrada" : "salida"
                    });
                }

                await EnviarRegistros(registros, backendUrl);
                Console.WriteLine("✅ Registros finalizados.");
            }
            else
            {
                Console.WriteLine("❌ No se pudieron leer los registros.");
            }

            zkem.Disconnect();
        }
        else
        {
            Console.WriteLine("❌ No se pudo conectar al dispositivo.");
        }

        Console.WriteLine("Presiona una tecla para salir...");
        Console.ReadKey();
    }

    static bool IsDeviceReachable(string ip)
    {
        try
        {
            return new Ping().Send(ip, 1000).Status == IPStatus.Success;
        }
        catch
        {
            return false;
        }
    }

    static async Task EnviarRegistros(List<object> registros, string backendUrl)
    {
        try
        {
            var client = new HttpClient();
            client.BaseAddress = new Uri(backendUrl);

            var content = new StringContent(JsonConvert.SerializeObject(registros), Encoding.UTF8, "application/json");
            var response = await client.PostAsync("/api/attendance/from-zkteco", content);

            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine("✅ Registros enviados correctamente al backend");
            }
            else
            {
                throw new Exception($"Error HTTP: {response.StatusCode}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"⚠️ Guardando en modo offline → {ex.Message}");
            foreach (var r in registros)
            {
                File.AppendAllText("offline_registros.json", JsonConvert.SerializeObject(r) + Environment.NewLine);
            }
        }
    }

    static async Task ReenviarRegistrosOffline(string backendUrl)
    {
        string path = "offline_registros.json";
        if (!File.Exists(path)) return;

        var lines = new List<string>(File.ReadAllLines(path));
        var exitosos = new List<string>();
        var client = new HttpClient();
        client.BaseAddress = new Uri(backendUrl);

        Console.WriteLine($"🔁 Reintentando envío de {lines.Count} registros offline...");

        foreach (var line in lines)
        {
            try
            {
                var content = new StringContent(line, Encoding.UTF8, "application/json");
                var response = await client.PostAsync("/api/attendance/from-zkteco", content);

                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine("☁️ Registro reenviado correctamente");
                    exitosos.Add(line);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Fallo al reenviar: {ex.Message}");
            }   
        }

        var restantes = new List<string>(lines);
        foreach (var ok in exitosos) restantes.Remove(ok);
        File.WriteAllLines(path, restantes);

        Console.WriteLine($"📦 Reenvío finalizado. Enviados: {exitosos.Count}, Restantes: {restantes.Count}");
    }
}

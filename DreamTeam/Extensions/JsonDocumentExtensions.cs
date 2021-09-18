using Microsoft.IO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace System.Text.Json
{
    public static class JsonDocumentExtensions
    {
        public static string ToJsonString(this JsonDocument doc)
        {
            using (var stream = DreamTeam.Program.Manager.GetStream())
            using (var writer = new Utf8JsonWriter(stream, new JsonWriterOptions { Indented = false }))
            {
                doc.WriteTo(writer);
                writer.Flush();

                return Encoding.UTF8.GetString(stream.ToArray());
            }
        }
    }
}

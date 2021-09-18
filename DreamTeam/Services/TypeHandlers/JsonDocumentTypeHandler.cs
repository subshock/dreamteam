using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace DreamTeam.Services.TypeHandlers
{
    public class JsonDocumentTypeHandler : SqlMapper.TypeHandler<JsonDocument>
    {
        public override JsonDocument Parse(object value)
        {
            if (value == null) return null;

            try
            {
                return JsonDocument.Parse(value as string);
            }
            catch
            {
                return null;
            }
        }

        public override void SetValue(IDbDataParameter parameter, JsonDocument value)
        {
            if (value == null)
            {
                parameter.Value = DBNull.Value;
            }
            else
            {
                parameter.Value = value.ToJsonString();
            }
        }
    }
}

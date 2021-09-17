using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace System
{
    public static class DreamTeamStringExtensions
    {
        public static bool SeCi(this string a, string b)
        {
            if (a == null) return b == null;
            if (b == null) return a == null;

            return string.Equals(a, b, StringComparison.OrdinalIgnoreCase);
        }
    }
}

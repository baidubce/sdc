using System.Collections.Generic;
using System.Threading.Tasks;

namespace Baiducloud.SDK.Client
{
    public static class AsyncEnumerableExtensions
    {
        public static async IAsyncEnumerable<T> ToAsyncEnumerable<T>(this T value)
        {
            await Task.Yield(); // 为了确保异步性
            yield return value;
        }
    }
}
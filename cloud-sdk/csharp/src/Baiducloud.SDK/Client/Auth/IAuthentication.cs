using System;
using System.Net.Http;

namespace Baiducloud.SDK.Client.Auth
{

    public interface IAuthentication
    {
        string AuthName{ get; }
        /// <summary>
        /// Apply authentication settings to header and query parameters.
        /// </summary>
        /// <param name="httpClient">httpClient.</param>
        /// <param name="requestOptions">reuest parameters.</param>
        /// <param name="method">HTTP method.</param>
        /// <param name="path">path of the request.</param>
        /// <returns>True if the parameters were successfully updated, otherwise throws an ApiException.</returns>
        /// <exception cref="ApiException">Thrown if failed to update the parameters.</exception>
        bool ApplyToParams(
            HttpClient httpClient,
            RequestOptions requestOptions,
            HttpMethod method,
            Uri uri);
    }
}
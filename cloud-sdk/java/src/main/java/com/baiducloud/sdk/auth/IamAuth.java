/*
 * 千帆SDK
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


package com.baiducloud.sdk.auth;

import com.baiducloud.sdk.ApiException;
import com.baiducloud.sdk.Pair;
import okhttp3.OkHttpClient;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URLEncoder;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.*;

public class IamAuth implements Authentication {
    private static final String CHARSET = "UTF-8";
    private static final String HEADER_HOST = "host";
    private static final String HEADER_CONTENT_MD5 = "content-md5";
    private static final String HEADER_CONTENT_LENGTH = "content-length";
    private static final String HEADER_CONTENT_TYPE = "content-type";

    private static final HashSet<String> BCE_HEADER_TO_SIGN =
            new HashSet<String>(Arrays.asList(HEADER_HOST, HEADER_CONTENT_MD5, HEADER_CONTENT_LENGTH));
    private static final String BCE_PREFIX = "x-bce-";
    private static final char[] DIGITS = new char[]{'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};
    private String iamAk;
    private String iamSk;
    private Integer signExpireInSeconds;

    public IamAuth(String iamAk, String iamSk, Integer signExpireInSeconds) {
        if (iamAk == null || iamSk == null) {
            throw new IllegalArgumentException("parameter cantnot be null");
        }
        if (signExpireInSeconds <=0 || signExpireInSeconds > 864000) {
            throw new IllegalArgumentException("signExpireInSeconds must between 0 and 86400");
        }
        this.iamAk = iamAk;
        this.iamSk = iamSk;
        this.signExpireInSeconds = signExpireInSeconds;
    }

    public IamAuth(String iamAk, String iamSk) {
        this(iamAk,iamSk, 1800);
    }

    private static String md5(String data, String charset) {
        try {
            byte[] msg = data.getBytes(charset);
            MessageDigest md = MessageDigest.getInstance("MD5");
            return encodeHex(md.digest(msg));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return null;
    }

    private static String encodeHex(byte[] data) {
        int l = data.length;
        char[] out = new char[l << 1];
        int i = 0;

        for (int j = 0; i < l; ++i) {
            out[j++] = DIGITS[(240 & data[i]) >>> 4];
            out[j++] = DIGITS[15 & data[i]];
        }

        return new String(out);
    }

    private static String hmacSha256(String key, String data) throws ApiException {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec signingKey = new SecretKeySpec(key.getBytes(),
                    mac.getAlgorithm());
            mac.init(signingKey);
            return encodeHex(mac.doFinal(data.getBytes()));
        } catch (Exception e) {
            e.printStackTrace();
            throw new ApiException("Fail to generate HMAC-SHA256 signature");
        }
    }

    private static String getCanonicalUri(String path) throws UnsupportedEncodingException {
        if (!path.startsWith("/")) {
            path = String.format("/%s", path);
        }

        String encodedString = URLEncoder.encode(path, CHARSET);
        return encodedString.replace("%2F", "/");
    }

    private static String getCanonicalQuery(List<Pair> params) throws UnsupportedEncodingException {
        if (params.isEmpty()) {
            return "";
        }

        TreeSet<String> querySet = new TreeSet<String>();
        for (Pair entry : params) {
            if (!entry.getName().equalsIgnoreCase("authorization")) {
                querySet.add(String.format("%s=%s",
                        URLEncoder.encode(entry.getName(), CHARSET),
                        URLEncoder.encode(entry.getValue(), CHARSET)));
            }
        }
        return String.join("&", querySet);
    }

    private static String[] getCanonicalHeaders(Map<String, String> headers) throws UnsupportedEncodingException {
        if (headers.isEmpty()) {
            return new String[]{"",""};
        }
        TreeSet<String> headerSet = new TreeSet<String>();
        TreeSet<String> canonicalSet = new TreeSet<String>();
        for (Map.Entry<String, String> entry : headers.entrySet()) {
            String key = entry.getKey().trim().toLowerCase();
            if (key.startsWith(BCE_PREFIX)
                    || BCE_HEADER_TO_SIGN.contains(key)) {
                headerSet.add(String.format("%s:%s", URLEncoder.encode(key, CHARSET),
                        URLEncoder.encode(entry.getValue().trim(), CHARSET)));
                canonicalSet.add(URLEncoder.encode(key, CHARSET));
            }
        }
        return new String[]{String.join(";", canonicalSet), String.join("\n", headerSet)};
    }

    private String sign(List<Pair> queryParams, Map<String, String> headerParams, String timestamp, String method, URI uri) {
        String path = uri.getPath();
        // 1. 生成signingKey
        //  1.1 authString,格式为：bce-auth-v1/{accessKeyId}/{timestamp}/{expirationPeriodInSeconds}
        String authStringPrefix = String.format("bce-auth-v1/%s/%s/%d",
                this.iamAk, timestamp, this.signExpireInSeconds);

        try {
            // 1.2.使用authStringPrefix加上SK，用SHA-256生成sign key
            String signingKey = hmacSha256(this.iamSk, authStringPrefix);

            // 2. 生成规范化uri
            String canonicalUri = getCanonicalUri(path);

            // 3. 生成规范化query string
            String canonicalQuery = getCanonicalQuery(queryParams);

            // 4. 生成规范化headers
            String[] canonicalHeaders = getCanonicalHeaders(headerParams);

            ArrayList<String> canonicalRequest = new ArrayList<String>();
            canonicalRequest.add(method);
            canonicalRequest.add(canonicalUri);
            canonicalRequest.add(canonicalQuery);
            canonicalRequest.add(canonicalHeaders[1]);

            String signature = hmacSha256(signingKey, String.join("\n", canonicalRequest));

            return String.format("%s/%s/%s", authStringPrefix, canonicalHeaders[0], signature);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private static String getCanonicalTime() {
        SimpleDateFormat utcDayFormat = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat utcHourFormat = new SimpleDateFormat("HH:mm:ss");
        utcDayFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
        utcHourFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
        Date now = new Date();
        return String.format("%sT%sZ", utcDayFormat.format(now), utcHourFormat.format(now));
    }

    @Override
    public String getAuthName() {
        return "IamAuth";
    }

    /**
     * Apply authentication settings to header and query params.
     *
     * @param queryParams  List of query parameters
     * @param headerParams Map of header parameters
     * @param cookieParams Map of cookie parameters
     * @param payload      HTTP request body
     * @param method       HTTP method
     * @param uri          URI
     * @throws ApiException if failed to update the parameters
     */
    @Override
    public void applyToParams(OkHttpClient httpClient, List<Pair> queryParams, Map<String, String> headerParams, Map<String, String> cookieParams, String payload, String method, URI uri) throws ApiException {
        if (iamAk == null || iamSk == null){
            throw new ApiException(-1, "IamAuth iamAk and iamSk cannot be empty （请填写正确的iamAk和iamSk）");
        }
        String timestamp = getCanonicalTime();
        headerParams.put(HEADER_CONTENT_MD5, md5(payload, CHARSET));
        String sign = sign(queryParams, headerParams, timestamp, method, uri);
        headerParams.put("Authorization", sign);
    }
}

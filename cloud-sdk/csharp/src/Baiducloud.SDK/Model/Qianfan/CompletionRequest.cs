/*
 * 千帆SDK
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * Generated by: https://github.com/openapitools/openapi-generator.git
 */


using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.IO;
using System.Runtime.Serialization;
using System.Text;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System.ComponentModel.DataAnnotations;
using FileParameter = Baiducloud.SDK.Client.FileParameter;
using OpenAPIDateConverter = Baiducloud.SDK.Client.OpenAPIDateConverter;
using Baiducloud.SDK.Client;

namespace Baiducloud.SDK.Model.Qianfan
{
    /// <summary>
    /// CompletionRequest
    /// </summary>
    [DataContract(Name = "CompletionRequest")]
    public partial class CompletionRequest : IEquatable<CompletionRequest>, IValidatableObject
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CompletionRequest" /> class.
        /// </summary>
        [JsonConstructorAttribute]
        protected CompletionRequest()
        {
            this.AdditionalProperties = new Dictionary<string, object>();
        }
        /// <summary>
        /// Initializes a new instance of the <see cref="CompletionRequest" /> class.
        /// </summary>
        /// <param name="prompt">请求信息 (required).</param>
        /// <param name="stream">是否以流式接口的形式返回数据，默认false.</param>
        /// <param name="temperature">说明： （1）较高的数值会使输出更加随机，而较低的数值会使其更加集中和确定 （2）范围 (0, 1.0]，不能为0 （3）建议该参数和top_p只设置1个.</param>
        /// <param name="topK">Top-K 采样参数，在每轮token生成时，保留k个概率最高的token作为候选。说明： （1）影响输出文本的多样性，取值越大，生成文本的多样性越强 （2）取值范围：正整数.</param>
        /// <param name="topP">说明： （1）影响输出文本的多样性，取值越大，生成文本的多样性越强 （2）取值范围 [0, 1.0] （3）建议该参数和temperature只设置1个.</param>
        /// <param name="penaltyScore">通过对已生成的token增加惩罚，减少重复生成的现象。说明： （1）值越大表示惩罚越大 （2）取值范围：[1.0, 2.0].</param>
        /// <param name="stop">生成停止标识。当模型生成结果以stop中某个元素结尾时，停止文本生成。说明： （1）每个元素长度不超过20字符。 （2）最多4个元素.</param>
        /// <param name="userId">表示最终用户的唯一标识符，可以监视和检测滥用行为，防止接口恶意调用.</param>
        public CompletionRequest(string prompt, bool stream = default(bool), decimal temperature = default(decimal), int topK = default(int), decimal topP = default(decimal), decimal penaltyScore = default(decimal), List<string> stop = default(List<string>), string userId = default(string))
        {
            // to ensure "prompt" is required (not null)
            if (prompt == null)
            {
                throw new ArgumentNullException("prompt is a required property for CompletionRequest and cannot be null");
            }
            this.Prompt = prompt;
            this.Stream = stream;
            this.Temperature = temperature;
            this.TopK = topK;
            this.TopP = topP;
            this.PenaltyScore = penaltyScore;
            this.Stop = stop;
            this.UserId = userId;
            this.AdditionalProperties = new Dictionary<string, object>();
        }

        /// <summary>
        /// 请求信息
        /// </summary>
        /// <value>请求信息</value>
        [DataMember(Name = "prompt", IsRequired = true, EmitDefaultValue = true)]
        public string Prompt { get; set; }

        /// <summary>
        /// 是否以流式接口的形式返回数据，默认false
        /// </summary>
        /// <value>是否以流式接口的形式返回数据，默认false</value>
        [DataMember(Name = "stream", EmitDefaultValue = true)]
        public bool Stream { get; set; }

        /// <summary>
        /// 说明： （1）较高的数值会使输出更加随机，而较低的数值会使其更加集中和确定 （2）范围 (0, 1.0]，不能为0 （3）建议该参数和top_p只设置1个
        /// </summary>
        /// <value>说明： （1）较高的数值会使输出更加随机，而较低的数值会使其更加集中和确定 （2）范围 (0, 1.0]，不能为0 （3）建议该参数和top_p只设置1个</value>
        [DataMember(Name = "temperature", EmitDefaultValue = false)]
        public decimal Temperature { get; set; }

        /// <summary>
        /// Top-K 采样参数，在每轮token生成时，保留k个概率最高的token作为候选。说明： （1）影响输出文本的多样性，取值越大，生成文本的多样性越强 （2）取值范围：正整数
        /// </summary>
        /// <value>Top-K 采样参数，在每轮token生成时，保留k个概率最高的token作为候选。说明： （1）影响输出文本的多样性，取值越大，生成文本的多样性越强 （2）取值范围：正整数</value>
        [DataMember(Name = "top_k", EmitDefaultValue = false)]
        public int TopK { get; set; }

        /// <summary>
        /// 说明： （1）影响输出文本的多样性，取值越大，生成文本的多样性越强 （2）取值范围 [0, 1.0] （3）建议该参数和temperature只设置1个
        /// </summary>
        /// <value>说明： （1）影响输出文本的多样性，取值越大，生成文本的多样性越强 （2）取值范围 [0, 1.0] （3）建议该参数和temperature只设置1个</value>
        [DataMember(Name = "top_p", EmitDefaultValue = false)]
        public decimal TopP { get; set; }

        /// <summary>
        /// 通过对已生成的token增加惩罚，减少重复生成的现象。说明： （1）值越大表示惩罚越大 （2）取值范围：[1.0, 2.0]
        /// </summary>
        /// <value>通过对已生成的token增加惩罚，减少重复生成的现象。说明： （1）值越大表示惩罚越大 （2）取值范围：[1.0, 2.0]</value>
        [DataMember(Name = "penalty_score", EmitDefaultValue = false)]
        public decimal PenaltyScore { get; set; }

        /// <summary>
        /// 生成停止标识。当模型生成结果以stop中某个元素结尾时，停止文本生成。说明： （1）每个元素长度不超过20字符。 （2）最多4个元素
        /// </summary>
        /// <value>生成停止标识。当模型生成结果以stop中某个元素结尾时，停止文本生成。说明： （1）每个元素长度不超过20字符。 （2）最多4个元素</value>
        [DataMember(Name = "stop", EmitDefaultValue = false)]
        public List<string> Stop { get; set; }

        /// <summary>
        /// 表示最终用户的唯一标识符，可以监视和检测滥用行为，防止接口恶意调用
        /// </summary>
        /// <value>表示最终用户的唯一标识符，可以监视和检测滥用行为，防止接口恶意调用</value>
        [DataMember(Name = "user_id", EmitDefaultValue = false)]
        public string UserId { get; set; }

        /// <summary>
        /// Gets or Sets additional properties
        /// </summary>
        [JsonExtensionData]
        public IDictionary<string, object> AdditionalProperties { get; set; }

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("class CompletionRequest {\n");
            sb.Append("  Prompt: ").Append(Prompt).Append("\n");
            sb.Append("  Stream: ").Append(Stream).Append("\n");
            sb.Append("  Temperature: ").Append(Temperature).Append("\n");
            sb.Append("  TopK: ").Append(TopK).Append("\n");
            sb.Append("  TopP: ").Append(TopP).Append("\n");
            sb.Append("  PenaltyScore: ").Append(PenaltyScore).Append("\n");
            sb.Append("  Stop: ").Append(Stop).Append("\n");
            sb.Append("  UserId: ").Append(UserId).Append("\n");
            sb.Append("  AdditionalProperties: ").Append(AdditionalProperties).Append("\n");
            sb.Append("}\n");
            return sb.ToString();
        }

        /// <summary>
        /// Returns the JSON string presentation of the object
        /// </summary>
        /// <returns>JSON string presentation of the object</returns>
        public virtual string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this, Newtonsoft.Json.Formatting.Indented);
        }

        /// <summary>
        /// Returns true if objects are equal
        /// </summary>
        /// <param name="input">Object to be compared</param>
        /// <returns>Boolean</returns>
        public override bool Equals(object input)
        {
            return this.Equals(input as CompletionRequest);
        }

        /// <summary>
        /// Returns true if CompletionRequest instances are equal
        /// </summary>
        /// <param name="input">Instance of CompletionRequest to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(CompletionRequest input)
        {
            if (input == null)
            {
                return false;
            }
            return 
                (
                    this.Prompt == input.Prompt ||
                    (this.Prompt != null &&
                    this.Prompt.Equals(input.Prompt))
                ) && 
                (
                    this.Stream == input.Stream ||
                    this.Stream.Equals(input.Stream)
                ) && 
                (
                    this.Temperature == input.Temperature ||
                    this.Temperature.Equals(input.Temperature)
                ) && 
                (
                    this.TopK == input.TopK ||
                    this.TopK.Equals(input.TopK)
                ) && 
                (
                    this.TopP == input.TopP ||
                    this.TopP.Equals(input.TopP)
                ) && 
                (
                    this.PenaltyScore == input.PenaltyScore ||
                    this.PenaltyScore.Equals(input.PenaltyScore)
                ) && 
                (
                    this.Stop == input.Stop ||
                    this.Stop != null &&
                    input.Stop != null &&
                    this.Stop.SequenceEqual(input.Stop)
                ) && 
                (
                    this.UserId == input.UserId ||
                    (this.UserId != null &&
                    this.UserId.Equals(input.UserId))
                )
                && (this.AdditionalProperties.Count == input.AdditionalProperties.Count && !this.AdditionalProperties.Except(input.AdditionalProperties).Any());
        }

        /// <summary>
        /// Gets the hash code
        /// </summary>
        /// <returns>Hash code</returns>
        public override int GetHashCode()
        {
            unchecked // Overflow is fine, just wrap
            {
                int hashCode = 41;
                if (this.Prompt != null)
                {
                    hashCode = (hashCode * 59) + this.Prompt.GetHashCode();
                }
                hashCode = (hashCode * 59) + this.Stream.GetHashCode();
                hashCode = (hashCode * 59) + this.Temperature.GetHashCode();
                hashCode = (hashCode * 59) + this.TopK.GetHashCode();
                hashCode = (hashCode * 59) + this.TopP.GetHashCode();
                hashCode = (hashCode * 59) + this.PenaltyScore.GetHashCode();
                if (this.Stop != null)
                {
                    hashCode = (hashCode * 59) + this.Stop.GetHashCode();
                }
                if (this.UserId != null)
                {
                    hashCode = (hashCode * 59) + this.UserId.GetHashCode();
                }
                if (this.AdditionalProperties != null)
                {
                    hashCode = (hashCode * 59) + this.AdditionalProperties.GetHashCode();
                }
                return hashCode;
            }
        }

        /// <summary>
        /// To validate all properties of the instance
        /// </summary>
        /// <param name="validationContext">Validation context</param>
        /// <returns>Validation Result</returns>
        IEnumerable<System.ComponentModel.DataAnnotations.ValidationResult> IValidatableObject.Validate(ValidationContext validationContext)
        {
            // Temperature (decimal) maximum
            if (this.Temperature > (decimal)1)
            {
                yield return new System.ComponentModel.DataAnnotations.ValidationResult("Invalid value for Temperature, must be a value less than or equal to 1.", new [] { "Temperature" });
            }

            // Temperature (decimal) minimum
            if (this.Temperature < (decimal)0)
            {
                yield return new System.ComponentModel.DataAnnotations.ValidationResult("Invalid value for Temperature, must be a value greater than or equal to 0.", new [] { "Temperature" });
            }

            // TopK (int) minimum
            if (this.TopK < (int)0)
            {
                yield return new System.ComponentModel.DataAnnotations.ValidationResult("Invalid value for TopK, must be a value greater than or equal to 0.", new [] { "TopK" });
            }

            // TopP (decimal) maximum
            if (this.TopP > (decimal)1)
            {
                yield return new System.ComponentModel.DataAnnotations.ValidationResult("Invalid value for TopP, must be a value less than or equal to 1.", new [] { "TopP" });
            }

            // TopP (decimal) minimum
            if (this.TopP < (decimal)0)
            {
                yield return new System.ComponentModel.DataAnnotations.ValidationResult("Invalid value for TopP, must be a value greater than or equal to 0.", new [] { "TopP" });
            }

            // PenaltyScore (decimal) maximum
            if (this.PenaltyScore > (decimal)2)
            {
                yield return new System.ComponentModel.DataAnnotations.ValidationResult("Invalid value for PenaltyScore, must be a value less than or equal to 2.", new [] { "PenaltyScore" });
            }

            // PenaltyScore (decimal) minimum
            if (this.PenaltyScore < (decimal)1)
            {
                yield return new System.ComponentModel.DataAnnotations.ValidationResult("Invalid value for PenaltyScore, must be a value greater than or equal to 1.", new [] { "PenaltyScore" });
            }

            yield break;
        }
    }

}

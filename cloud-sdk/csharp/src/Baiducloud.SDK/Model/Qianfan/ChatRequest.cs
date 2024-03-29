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
    /// ChatRequest
    /// </summary>
    [DataContract(Name = "ChatRequest")]
    public partial class ChatRequest : IEquatable<ChatRequest>, IValidatableObject
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ChatRequest" /> class.
        /// </summary>
        [JsonConstructorAttribute]
        protected ChatRequest()
        {
            this.AdditionalProperties = new Dictionary<string, object>();
        }
        /// <summary>
        /// Initializes a new instance of the <see cref="ChatRequest" /> class.
        /// </summary>
        /// <param name="messages">messages (required).</param>
        /// <param name="functions">functions.</param>
        /// <param name="temperature">temperature.</param>
        /// <param name="topP">topP.</param>
        /// <param name="penaltyScore">penaltyScore.</param>
        /// <param name="stream">stream.</param>
        /// <param name="varSystem">varSystem.</param>
        /// <param name="stop">stop.</param>
        /// <param name="disableSearch">disableSearch.</param>
        /// <param name="enableCitation">enableCitation.</param>
        /// <param name="userId">userId.</param>
        public ChatRequest(List<ChatMessage> messages, List<ChatFunction> functions = default(List<ChatFunction>), decimal temperature = default(decimal), decimal topP = default(decimal), decimal penaltyScore = default(decimal), bool stream = default(bool), string varSystem = default(string), List<string> stop = default(List<string>), bool disableSearch = default(bool), bool enableCitation = default(bool), string userId = default(string))
        {
            // to ensure "messages" is required (not null)
            if (messages == null)
            {
                throw new ArgumentNullException("messages is a required property for ChatRequest and cannot be null");
            }
            this.Messages = messages;
            this.Functions = functions;
            this.Temperature = temperature;
            this.TopP = topP;
            this.PenaltyScore = penaltyScore;
            this.Stream = stream;
            this.VarSystem = varSystem;
            this.Stop = stop;
            this.DisableSearch = disableSearch;
            this.EnableCitation = enableCitation;
            this.UserId = userId;
            this.AdditionalProperties = new Dictionary<string, object>();
        }

        /// <summary>
        /// Gets or Sets Messages
        /// </summary>
        [DataMember(Name = "messages", IsRequired = true, EmitDefaultValue = true)]
        public List<ChatMessage> Messages { get; set; }

        /// <summary>
        /// Gets or Sets Functions
        /// </summary>
        [DataMember(Name = "functions", EmitDefaultValue = false)]
        public List<ChatFunction> Functions { get; set; }

        /// <summary>
        /// Gets or Sets Temperature
        /// </summary>
        [DataMember(Name = "temperature", EmitDefaultValue = false)]
        public decimal Temperature { get; set; }

        /// <summary>
        /// Gets or Sets TopP
        /// </summary>
        [DataMember(Name = "top_p", EmitDefaultValue = false)]
        public decimal TopP { get; set; }

        /// <summary>
        /// Gets or Sets PenaltyScore
        /// </summary>
        [DataMember(Name = "penalty_score", EmitDefaultValue = false)]
        public decimal PenaltyScore { get; set; }

        /// <summary>
        /// Gets or Sets Stream
        /// </summary>
        [DataMember(Name = "stream", EmitDefaultValue = true)]
        public bool Stream { get; set; }

        /// <summary>
        /// Gets or Sets VarSystem
        /// </summary>
        [DataMember(Name = "system", EmitDefaultValue = false)]
        public string VarSystem { get; set; }

        /// <summary>
        /// Gets or Sets Stop
        /// </summary>
        [DataMember(Name = "stop", EmitDefaultValue = false)]
        public List<string> Stop { get; set; }

        /// <summary>
        /// Gets or Sets DisableSearch
        /// </summary>
        [DataMember(Name = "disable_search", EmitDefaultValue = true)]
        public bool DisableSearch { get; set; }

        /// <summary>
        /// Gets or Sets EnableCitation
        /// </summary>
        [DataMember(Name = "enable_citation", EmitDefaultValue = true)]
        public bool EnableCitation { get; set; }

        /// <summary>
        /// Gets or Sets UserId
        /// </summary>
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
            sb.Append("class ChatRequest {\n");
            sb.Append("  Messages: ").Append(Messages).Append("\n");
            sb.Append("  Functions: ").Append(Functions).Append("\n");
            sb.Append("  Temperature: ").Append(Temperature).Append("\n");
            sb.Append("  TopP: ").Append(TopP).Append("\n");
            sb.Append("  PenaltyScore: ").Append(PenaltyScore).Append("\n");
            sb.Append("  Stream: ").Append(Stream).Append("\n");
            sb.Append("  VarSystem: ").Append(VarSystem).Append("\n");
            sb.Append("  Stop: ").Append(Stop).Append("\n");
            sb.Append("  DisableSearch: ").Append(DisableSearch).Append("\n");
            sb.Append("  EnableCitation: ").Append(EnableCitation).Append("\n");
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
            return this.Equals(input as ChatRequest);
        }

        /// <summary>
        /// Returns true if ChatRequest instances are equal
        /// </summary>
        /// <param name="input">Instance of ChatRequest to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(ChatRequest input)
        {
            if (input == null)
            {
                return false;
            }
            return 
                (
                    this.Messages == input.Messages ||
                    this.Messages != null &&
                    input.Messages != null &&
                    this.Messages.SequenceEqual(input.Messages)
                ) && 
                (
                    this.Functions == input.Functions ||
                    this.Functions != null &&
                    input.Functions != null &&
                    this.Functions.SequenceEqual(input.Functions)
                ) && 
                (
                    this.Temperature == input.Temperature ||
                    this.Temperature.Equals(input.Temperature)
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
                    this.Stream == input.Stream ||
                    this.Stream.Equals(input.Stream)
                ) && 
                (
                    this.VarSystem == input.VarSystem ||
                    (this.VarSystem != null &&
                    this.VarSystem.Equals(input.VarSystem))
                ) && 
                (
                    this.Stop == input.Stop ||
                    this.Stop != null &&
                    input.Stop != null &&
                    this.Stop.SequenceEqual(input.Stop)
                ) && 
                (
                    this.DisableSearch == input.DisableSearch ||
                    this.DisableSearch.Equals(input.DisableSearch)
                ) && 
                (
                    this.EnableCitation == input.EnableCitation ||
                    this.EnableCitation.Equals(input.EnableCitation)
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
                if (this.Messages != null)
                {
                    hashCode = (hashCode * 59) + this.Messages.GetHashCode();
                }
                if (this.Functions != null)
                {
                    hashCode = (hashCode * 59) + this.Functions.GetHashCode();
                }
                hashCode = (hashCode * 59) + this.Temperature.GetHashCode();
                hashCode = (hashCode * 59) + this.TopP.GetHashCode();
                hashCode = (hashCode * 59) + this.PenaltyScore.GetHashCode();
                hashCode = (hashCode * 59) + this.Stream.GetHashCode();
                if (this.VarSystem != null)
                {
                    hashCode = (hashCode * 59) + this.VarSystem.GetHashCode();
                }
                if (this.Stop != null)
                {
                    hashCode = (hashCode * 59) + this.Stop.GetHashCode();
                }
                hashCode = (hashCode * 59) + this.DisableSearch.GetHashCode();
                hashCode = (hashCode * 59) + this.EnableCitation.GetHashCode();
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

            // VarSystem (string) maxLength
            if (this.VarSystem != null && this.VarSystem.Length > 1024)
            {
                yield return new System.ComponentModel.DataAnnotations.ValidationResult("Invalid value for VarSystem, length must be less than 1024.", new [] { "VarSystem" });
            }

            yield break;
        }
    }

}

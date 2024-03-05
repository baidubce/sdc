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
    /// EmbeddingData
    /// </summary>
    [DataContract(Name = "EmbeddingData")]
    public partial class EmbeddingData : IEquatable<EmbeddingData>, IValidatableObject
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="EmbeddingData" /> class.
        /// </summary>
        [JsonConstructorAttribute]
        protected EmbeddingData()
        {
            this.AdditionalProperties = new Dictionary<string, object>();
        }
        /// <summary>
        /// Initializes a new instance of the <see cref="EmbeddingData" /> class.
        /// </summary>
        /// <param name="varObject">varObject.</param>
        /// <param name="embedding">embedding.</param>
        /// <param name="index">index.</param>
        public EmbeddingData(string varObject = default(string), List<decimal> embedding = default(List<decimal>), int index = default(int))
        {
            this.VarObject = varObject;
            this.Embedding = embedding;
            this.Index = index;
            this.AdditionalProperties = new Dictionary<string, object>();
        }

        /// <summary>
        /// Gets or Sets VarObject
        /// </summary>
        [DataMember(Name = "object", EmitDefaultValue = false)]
        public string VarObject { get; set; }

        /// <summary>
        /// Gets or Sets Embedding
        /// </summary>
        [DataMember(Name = "embedding", EmitDefaultValue = false)]
        public List<decimal> Embedding { get; set; }

        /// <summary>
        /// Gets or Sets Index
        /// </summary>
        [DataMember(Name = "index", EmitDefaultValue = false)]
        public int Index { get; set; }

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
            sb.Append("class EmbeddingData {\n");
            sb.Append("  VarObject: ").Append(VarObject).Append("\n");
            sb.Append("  Embedding: ").Append(Embedding).Append("\n");
            sb.Append("  Index: ").Append(Index).Append("\n");
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
            return this.Equals(input as EmbeddingData);
        }

        /// <summary>
        /// Returns true if EmbeddingData instances are equal
        /// </summary>
        /// <param name="input">Instance of EmbeddingData to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(EmbeddingData input)
        {
            if (input == null)
            {
                return false;
            }
            return 
                (
                    this.VarObject == input.VarObject ||
                    (this.VarObject != null &&
                    this.VarObject.Equals(input.VarObject))
                ) && 
                (
                    this.Embedding == input.Embedding ||
                    this.Embedding != null &&
                    input.Embedding != null &&
                    this.Embedding.SequenceEqual(input.Embedding)
                ) && 
                (
                    this.Index == input.Index ||
                    this.Index.Equals(input.Index)
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
                if (this.VarObject != null)
                {
                    hashCode = (hashCode * 59) + this.VarObject.GetHashCode();
                }
                if (this.Embedding != null)
                {
                    hashCode = (hashCode * 59) + this.Embedding.GetHashCode();
                }
                hashCode = (hashCode * 59) + this.Index.GetHashCode();
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
            yield break;
        }
    }

}
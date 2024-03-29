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


package com.baiducloud.sdk.model.qianfan;

import java.util.Objects;
import com.baiducloud.sdk.model.qianfan.ChatMessage;
import com.google.gson.TypeAdapter;
import com.google.gson.annotations.JsonAdapter;
import com.google.gson.annotations.SerializedName;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.TypeAdapterFactory;
import com.google.gson.reflect.TypeToken;
import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import java.io.IOException;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.baiducloud.sdk.JSON;

/**
 * ChatFunction
 */
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.BaiduCtsQianfanJavaCodegen")
public class ChatFunction {
  public static final String SERIALIZED_NAME_NAME = "name";
  @SerializedName(SERIALIZED_NAME_NAME)
  private String name;

  public static final String SERIALIZED_NAME_DESCRIPTION = "description";
  @SerializedName(SERIALIZED_NAME_DESCRIPTION)
  private String description;

  public static final String SERIALIZED_NAME_PARAMETERS = "parameters";
  @SerializedName(SERIALIZED_NAME_PARAMETERS)
  private Map<String, Object> parameters = new HashMap<>();

  public static final String SERIALIZED_NAME_RESPONSES = "responses";
  @SerializedName(SERIALIZED_NAME_RESPONSES)
  private Map<String, Object> responses = new HashMap<>();

  public static final String SERIALIZED_NAME_EXAMPLES = "examples";
  @SerializedName(SERIALIZED_NAME_EXAMPLES)
  private List<ChatMessage> examples;

  public ChatFunction() {
  }

  public ChatFunction name(String name) {
    
    this.name = name;
    return this;
  }

   /**
   * 函数名
   * @return name
  **/
  @javax.annotation.Nonnull
  public String getName() {
    return name;
  }


  public void setName(String name) {
    this.name = name;
  }


  public ChatFunction description(String description) {
    
    this.description = description;
    return this;
  }

   /**
   * 函数描述
   * @return description
  **/
  @javax.annotation.Nonnull
  public String getDescription() {
    return description;
  }


  public void setDescription(String description) {
    this.description = description;
  }


  public ChatFunction parameters(Map<String, Object> parameters) {
    
    this.parameters = parameters;
    return this;
  }

  public ChatFunction putParametersItem(String key, Object parametersItem) {
    if (this.parameters == null) {
      this.parameters = new HashMap<>();
    }
    this.parameters.put(key, parametersItem);
    return this;
  }

   /**
   * 函数请求参数，说明： （1）JSON Schema 格式，参考JSON Schema描述 （2）如果函数没有请求参数，parameters值格式如下： {\&quot;type\&quot;: \&quot;object\&quot;,\&quot;properties\&quot;: {}}
   * @return parameters
  **/
  @javax.annotation.Nonnull
  public Map<String, Object> getParameters() {
    return parameters;
  }


  public void setParameters(Map<String, Object> parameters) {
    this.parameters = parameters;
  }


  public ChatFunction responses(Map<String, Object> responses) {
    
    this.responses = responses;
    return this;
  }

  public ChatFunction putResponsesItem(String key, Object responsesItem) {
    if (this.responses == null) {
      this.responses = new HashMap<>();
    }
    this.responses.put(key, responsesItem);
    return this;
  }

   /**
   * 函数响应参数，JSON Schema 格式，参考JSON Schema描述
   * @return responses
  **/
  @javax.annotation.Nullable
  public Map<String, Object> getResponses() {
    return responses;
  }


  public void setResponses(Map<String, Object> responses) {
    this.responses = responses;
  }


  public ChatFunction examples(List<ChatMessage> examples) {
    
    this.examples = examples;
    return this;
  }

  public ChatFunction addExamplesItem(ChatMessage examplesItem) {
    if (this.examples == null) {
      this.examples = new ArrayList<>();
    }
    this.examples.add(examplesItem);
    return this;
  }

   /**
   * function调用的一些历史示例
   * @return examples
  **/
  @javax.annotation.Nullable
  public List<ChatMessage> getExamples() {
    return examples;
  }


  public void setExamples(List<ChatMessage> examples) {
    this.examples = examples;
  }

  /**
   * A container for additional, undeclared properties.
   * This is a holder for any undeclared properties as specified with
   * the 'additionalProperties' keyword in the OAS document.
   */
  private Map<String, Object> additionalProperties;

  /**
   * Set the additional (undeclared) property with the specified name and value.
   * If the property does not already exist, create it otherwise replace it.
   *
   * @param key name of the property
   * @param value value of the property
   * @return the ChatFunction instance itself
   */
  public ChatFunction putAdditionalProperty(String key, Object value) {
    if (this.additionalProperties == null) {
        this.additionalProperties = new HashMap<String, Object>();
    }
    this.additionalProperties.put(key, value);
    return this;
  }

  /**
   * Return the additional (undeclared) property.
   *
   * @return a map of objects
   */
  public Map<String, Object> getAdditionalProperties() {
    return additionalProperties;
  }

  /**
   * Return the additional (undeclared) property with the specified name.
   *
   * @param key name of the property
   * @return an object
   */
  public Object getAdditionalProperty(String key) {
    if (this.additionalProperties == null) {
        return null;
    }
    return this.additionalProperties.get(key);
  }


  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ChatFunction chatFunction = (ChatFunction) o;
    return Objects.equals(this.name, chatFunction.name) &&
        Objects.equals(this.description, chatFunction.description) &&
        Objects.equals(this.parameters, chatFunction.parameters) &&
        Objects.equals(this.responses, chatFunction.responses) &&
        Objects.equals(this.examples, chatFunction.examples)&&
        Objects.equals(this.additionalProperties, chatFunction.additionalProperties);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, description, parameters, responses, examples, additionalProperties);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ChatFunction {\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
    sb.append("    parameters: ").append(toIndentedString(parameters)).append("\n");
    sb.append("    responses: ").append(toIndentedString(responses)).append("\n");
    sb.append("    examples: ").append(toIndentedString(examples)).append("\n");
    sb.append("    additionalProperties: ").append(toIndentedString(additionalProperties)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }


  public static HashSet<String> openapiFields;
  public static HashSet<String> openapiRequiredFields;

  static {
    // a set of all properties/fields (JSON key names)
    openapiFields = new HashSet<String>();
    openapiFields.add("name");
    openapiFields.add("description");
    openapiFields.add("parameters");
    openapiFields.add("responses");
    openapiFields.add("examples");

    // a set of required properties/fields (JSON key names)
    openapiRequiredFields = new HashSet<String>();
    openapiRequiredFields.add("name");
    openapiRequiredFields.add("description");
    openapiRequiredFields.add("parameters");
  }

 /**
  * Validates the JSON Element and throws an exception if issues found
  *
  * @param jsonElement JSON Element
  * @throws IOException if the JSON Element is invalid with respect to ChatFunction
  */
  public static void validateJsonElement(JsonElement jsonElement) throws IOException {
      if (jsonElement == null) {
        if (!ChatFunction.openapiRequiredFields.isEmpty()) { // has required fields but JSON element is null
          throw new IllegalArgumentException(String.format("The required field(s) %s in ChatFunction is not found in the empty JSON string", ChatFunction.openapiRequiredFields.toString()));
        }
      }

      // check to make sure all required properties/fields are present in the JSON string
      for (String requiredField : ChatFunction.openapiRequiredFields) {
        if (jsonElement.getAsJsonObject().get(requiredField) == null) {
          throw new IllegalArgumentException(String.format("The required field `%s` is not found in the JSON string: %s", requiredField, jsonElement.toString()));
        }
      }
        JsonObject jsonObj = jsonElement.getAsJsonObject();
      if (!jsonObj.get("name").isJsonPrimitive()) {
        throw new IllegalArgumentException(String.format("Expected the field `name` to be a primitive type in the JSON string but got `%s`", jsonObj.get("name").toString()));
      }
      if (!jsonObj.get("description").isJsonPrimitive()) {
        throw new IllegalArgumentException(String.format("Expected the field `description` to be a primitive type in the JSON string but got `%s`", jsonObj.get("description").toString()));
      }
      // ensure the optional json data is an array if present
      if (jsonObj.get("examples") != null && !jsonObj.get("examples").isJsonNull() && !jsonObj.get("examples").isJsonArray()) {
        throw new IllegalArgumentException(String.format("Expected the field `examples` to be an array in the JSON string but got `%s`", jsonObj.get("examples").toString()));
      }
  }

  public static class CustomTypeAdapterFactory implements TypeAdapterFactory {
    @SuppressWarnings("unchecked")
    @Override
    public <T> TypeAdapter<T> create(Gson gson, TypeToken<T> type) {
       if (!ChatFunction.class.isAssignableFrom(type.getRawType())) {
         return null; // this class only serializes 'ChatFunction' and its subtypes
       }
       final TypeAdapter<JsonElement> elementAdapter = gson.getAdapter(JsonElement.class);
       final TypeAdapter<ChatFunction> thisAdapter
                        = gson.getDelegateAdapter(this, TypeToken.get(ChatFunction.class));

       return (TypeAdapter<T>) new TypeAdapter<ChatFunction>() {
           @Override
           public void write(JsonWriter out, ChatFunction value) throws IOException {
             JsonObject obj = thisAdapter.toJsonTree(value).getAsJsonObject();
             obj.remove("additionalProperties");
             // serialize additional properties
             if (value.getAdditionalProperties() != null) {
               for (Map.Entry<String, Object> entry : value.getAdditionalProperties().entrySet()) {
                 if (entry.getValue() instanceof String)
                   obj.addProperty(entry.getKey(), (String) entry.getValue());
                 else if (entry.getValue() instanceof Number)
                   obj.addProperty(entry.getKey(), (Number) entry.getValue());
                 else if (entry.getValue() instanceof Boolean)
                   obj.addProperty(entry.getKey(), (Boolean) entry.getValue());
                 else if (entry.getValue() instanceof Character)
                   obj.addProperty(entry.getKey(), (Character) entry.getValue());
                 else {
                   obj.add(entry.getKey(), gson.toJsonTree(entry.getValue()).getAsJsonObject());
                 }
               }
             }
             elementAdapter.write(out, obj);
           }

           @Override
           public ChatFunction read(JsonReader in) throws IOException {
             JsonElement jsonElement = elementAdapter.read(in);
             validateJsonElement(jsonElement);
             JsonObject jsonObj = jsonElement.getAsJsonObject();
             // store additional fields in the deserialized instance
             ChatFunction instance = thisAdapter.fromJsonTree(jsonObj);
             for (Map.Entry<String, JsonElement> entry : jsonObj.entrySet()) {
               if (!openapiFields.contains(entry.getKey())) {
                 if (entry.getValue().isJsonPrimitive()) { // primitive type
                   if (entry.getValue().getAsJsonPrimitive().isString())
                     instance.putAdditionalProperty(entry.getKey(), entry.getValue().getAsString());
                   else if (entry.getValue().getAsJsonPrimitive().isNumber())
                     instance.putAdditionalProperty(entry.getKey(), entry.getValue().getAsNumber());
                   else if (entry.getValue().getAsJsonPrimitive().isBoolean())
                     instance.putAdditionalProperty(entry.getKey(), entry.getValue().getAsBoolean());
                   else
                     throw new IllegalArgumentException(String.format("The field `%s` has unknown primitive type. Value: %s", entry.getKey(), entry.getValue().toString()));
                 } else if (entry.getValue().isJsonArray()) {
                     instance.putAdditionalProperty(entry.getKey(), gson.fromJson(entry.getValue(), List.class));
                 } else { // JSON object
                     instance.putAdditionalProperty(entry.getKey(), gson.fromJson(entry.getValue(), HashMap.class));
                 }
               }
             }
             return instance;
           }

       }.nullSafe();
    }
  }

 /**
  * Create an instance of ChatFunction given an JSON string
  *
  * @param jsonString JSON string
  * @return An instance of ChatFunction
  * @throws IOException if the JSON string is invalid with respect to ChatFunction
  */
  public static ChatFunction fromJson(String jsonString) throws IOException {
    return JSON.getGson().fromJson(jsonString, ChatFunction.class);
  }

 /**
  * Convert an instance of ChatFunction to an JSON string
  *
  * @return JSON string
  */
  public String toJson() {
    return JSON.getGson().toJson(this);
  }
}


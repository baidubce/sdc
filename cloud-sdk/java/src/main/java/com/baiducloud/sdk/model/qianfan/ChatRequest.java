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
import com.baiducloud.sdk.model.qianfan.ChatFunction;
import com.baiducloud.sdk.model.qianfan.ChatMessage;
import com.google.gson.TypeAdapter;
import com.google.gson.annotations.JsonAdapter;
import com.google.gson.annotations.SerializedName;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

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
 * ChatRequest
 */
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.BaiduCtsQianfanJavaCodegen")
public class ChatRequest {
  public static final String SERIALIZED_NAME_MESSAGES = "messages";
  @SerializedName(SERIALIZED_NAME_MESSAGES)
  private List<ChatMessage> messages = new ArrayList<>();

  public static final String SERIALIZED_NAME_FUNCTIONS = "functions";
  @SerializedName(SERIALIZED_NAME_FUNCTIONS)
  private List<ChatFunction> functions;

  public static final String SERIALIZED_NAME_TEMPERATURE = "temperature";
  @SerializedName(SERIALIZED_NAME_TEMPERATURE)
  private BigDecimal temperature;

  public static final String SERIALIZED_NAME_TOP_P = "top_p";
  @SerializedName(SERIALIZED_NAME_TOP_P)
  private BigDecimal topP;

  public static final String SERIALIZED_NAME_PENALTY_SCORE = "penalty_score";
  @SerializedName(SERIALIZED_NAME_PENALTY_SCORE)
  private BigDecimal penaltyScore;

  public static final String SERIALIZED_NAME_STREAM = "stream";
  @SerializedName(SERIALIZED_NAME_STREAM)
  private Boolean stream;

  public static final String SERIALIZED_NAME_SYSTEM = "system";
  @SerializedName(SERIALIZED_NAME_SYSTEM)
  private String system;

  public static final String SERIALIZED_NAME_STOP = "stop";
  @SerializedName(SERIALIZED_NAME_STOP)
  private List<String> stop;

  public static final String SERIALIZED_NAME_DISABLE_SEARCH = "disable_search";
  @SerializedName(SERIALIZED_NAME_DISABLE_SEARCH)
  private Boolean disableSearch;

  public static final String SERIALIZED_NAME_ENABLE_CITATION = "enable_citation";
  @SerializedName(SERIALIZED_NAME_ENABLE_CITATION)
  private Boolean enableCitation;

  public static final String SERIALIZED_NAME_USER_ID = "user_id";
  @SerializedName(SERIALIZED_NAME_USER_ID)
  private String userId;

  public ChatRequest() {
  }

  public ChatRequest messages(List<ChatMessage> messages) {
    
    this.messages = messages;
    return this;
  }

  public ChatRequest addMessagesItem(ChatMessage messagesItem) {
    if (this.messages == null) {
      this.messages = new ArrayList<>();
    }
    this.messages.add(messagesItem);
    return this;
  }

   /**
   * Get messages
   * @return messages
  **/
  @javax.annotation.Nonnull
  public List<ChatMessage> getMessages() {
    return messages;
  }


  public void setMessages(List<ChatMessage> messages) {
    this.messages = messages;
  }


  public ChatRequest functions(List<ChatFunction> functions) {
    
    this.functions = functions;
    return this;
  }

  public ChatRequest addFunctionsItem(ChatFunction functionsItem) {
    if (this.functions == null) {
      this.functions = new ArrayList<>();
    }
    this.functions.add(functionsItem);
    return this;
  }

   /**
   * Get functions
   * @return functions
  **/
  @javax.annotation.Nullable
  public List<ChatFunction> getFunctions() {
    return functions;
  }


  public void setFunctions(List<ChatFunction> functions) {
    this.functions = functions;
  }


  public ChatRequest temperature(BigDecimal temperature) {
    
    this.temperature = temperature;
    return this;
  }

   /**
   * Get temperature
   * minimum: 0
   * maximum: 1
   * @return temperature
  **/
  @javax.annotation.Nullable
  public BigDecimal getTemperature() {
    return temperature;
  }


  public void setTemperature(BigDecimal temperature) {
    this.temperature = temperature;
  }


  public ChatRequest topP(BigDecimal topP) {
    
    this.topP = topP;
    return this;
  }

   /**
   * Get topP
   * minimum: 0
   * maximum: 1
   * @return topP
  **/
  @javax.annotation.Nullable
  public BigDecimal getTopP() {
    return topP;
  }


  public void setTopP(BigDecimal topP) {
    this.topP = topP;
  }


  public ChatRequest penaltyScore(BigDecimal penaltyScore) {
    
    this.penaltyScore = penaltyScore;
    return this;
  }

   /**
   * Get penaltyScore
   * minimum: 1
   * maximum: 2
   * @return penaltyScore
  **/
  @javax.annotation.Nullable
  public BigDecimal getPenaltyScore() {
    return penaltyScore;
  }


  public void setPenaltyScore(BigDecimal penaltyScore) {
    this.penaltyScore = penaltyScore;
  }


  public ChatRequest stream(Boolean stream) {
    
    this.stream = stream;
    return this;
  }

   /**
   * Get stream
   * @return stream
  **/
  @javax.annotation.Nullable
  public Boolean getStream() {
    return stream;
  }


  public void setStream(Boolean stream) {
    this.stream = stream;
  }


  public ChatRequest system(String system) {
    
    this.system = system;
    return this;
  }

   /**
   * Get system
   * @return system
  **/
  @javax.annotation.Nullable
  public String getSystem() {
    return system;
  }


  public void setSystem(String system) {
    this.system = system;
  }


  public ChatRequest stop(List<String> stop) {
    
    this.stop = stop;
    return this;
  }

  public ChatRequest addStopItem(String stopItem) {
    if (this.stop == null) {
      this.stop = new ArrayList<>();
    }
    this.stop.add(stopItem);
    return this;
  }

   /**
   * Get stop
   * @return stop
  **/
  @javax.annotation.Nullable
  public List<String> getStop() {
    return stop;
  }


  public void setStop(List<String> stop) {
    this.stop = stop;
  }


  public ChatRequest disableSearch(Boolean disableSearch) {
    
    this.disableSearch = disableSearch;
    return this;
  }

   /**
   * Get disableSearch
   * @return disableSearch
  **/
  @javax.annotation.Nullable
  public Boolean getDisableSearch() {
    return disableSearch;
  }


  public void setDisableSearch(Boolean disableSearch) {
    this.disableSearch = disableSearch;
  }


  public ChatRequest enableCitation(Boolean enableCitation) {
    
    this.enableCitation = enableCitation;
    return this;
  }

   /**
   * Get enableCitation
   * @return enableCitation
  **/
  @javax.annotation.Nullable
  public Boolean getEnableCitation() {
    return enableCitation;
  }


  public void setEnableCitation(Boolean enableCitation) {
    this.enableCitation = enableCitation;
  }


  public ChatRequest userId(String userId) {
    
    this.userId = userId;
    return this;
  }

   /**
   * Get userId
   * @return userId
  **/
  @javax.annotation.Nullable
  public String getUserId() {
    return userId;
  }


  public void setUserId(String userId) {
    this.userId = userId;
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
   * @return the ChatRequest instance itself
   */
  public ChatRequest putAdditionalProperty(String key, Object value) {
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
    ChatRequest chatRequest = (ChatRequest) o;
    return Objects.equals(this.messages, chatRequest.messages) &&
        Objects.equals(this.functions, chatRequest.functions) &&
        Objects.equals(this.temperature, chatRequest.temperature) &&
        Objects.equals(this.topP, chatRequest.topP) &&
        Objects.equals(this.penaltyScore, chatRequest.penaltyScore) &&
        Objects.equals(this.stream, chatRequest.stream) &&
        Objects.equals(this.system, chatRequest.system) &&
        Objects.equals(this.stop, chatRequest.stop) &&
        Objects.equals(this.disableSearch, chatRequest.disableSearch) &&
        Objects.equals(this.enableCitation, chatRequest.enableCitation) &&
        Objects.equals(this.userId, chatRequest.userId)&&
        Objects.equals(this.additionalProperties, chatRequest.additionalProperties);
  }

  @Override
  public int hashCode() {
    return Objects.hash(messages, functions, temperature, topP, penaltyScore, stream, system, stop, disableSearch, enableCitation, userId, additionalProperties);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ChatRequest {\n");
    sb.append("    messages: ").append(toIndentedString(messages)).append("\n");
    sb.append("    functions: ").append(toIndentedString(functions)).append("\n");
    sb.append("    temperature: ").append(toIndentedString(temperature)).append("\n");
    sb.append("    topP: ").append(toIndentedString(topP)).append("\n");
    sb.append("    penaltyScore: ").append(toIndentedString(penaltyScore)).append("\n");
    sb.append("    stream: ").append(toIndentedString(stream)).append("\n");
    sb.append("    system: ").append(toIndentedString(system)).append("\n");
    sb.append("    stop: ").append(toIndentedString(stop)).append("\n");
    sb.append("    disableSearch: ").append(toIndentedString(disableSearch)).append("\n");
    sb.append("    enableCitation: ").append(toIndentedString(enableCitation)).append("\n");
    sb.append("    userId: ").append(toIndentedString(userId)).append("\n");
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
    openapiFields.add("messages");
    openapiFields.add("functions");
    openapiFields.add("temperature");
    openapiFields.add("top_p");
    openapiFields.add("penalty_score");
    openapiFields.add("stream");
    openapiFields.add("system");
    openapiFields.add("stop");
    openapiFields.add("disable_search");
    openapiFields.add("enable_citation");
    openapiFields.add("user_id");

    // a set of required properties/fields (JSON key names)
    openapiRequiredFields = new HashSet<String>();
    openapiRequiredFields.add("messages");
  }

 /**
  * Validates the JSON Element and throws an exception if issues found
  *
  * @param jsonElement JSON Element
  * @throws IOException if the JSON Element is invalid with respect to ChatRequest
  */
  public static void validateJsonElement(JsonElement jsonElement) throws IOException {
      if (jsonElement == null) {
        if (!ChatRequest.openapiRequiredFields.isEmpty()) { // has required fields but JSON element is null
          throw new IllegalArgumentException(String.format("The required field(s) %s in ChatRequest is not found in the empty JSON string", ChatRequest.openapiRequiredFields.toString()));
        }
      }

      // check to make sure all required properties/fields are present in the JSON string
      for (String requiredField : ChatRequest.openapiRequiredFields) {
        if (jsonElement.getAsJsonObject().get(requiredField) == null) {
          throw new IllegalArgumentException(String.format("The required field `%s` is not found in the JSON string: %s", requiredField, jsonElement.toString()));
        }
      }
        JsonObject jsonObj = jsonElement.getAsJsonObject();
      // ensure the required json array is present
      if (jsonObj.get("messages") == null) {
        throw new IllegalArgumentException("Expected the field `linkedContent` to be an array in the JSON string but got `null`");
      } else if (!jsonObj.get("messages").isJsonArray()) {
        throw new IllegalArgumentException(String.format("Expected the field `messages` to be an array in the JSON string but got `%s`", jsonObj.get("messages").toString()));
      }
      // ensure the optional json data is an array if present
      if (jsonObj.get("functions") != null && !jsonObj.get("functions").isJsonNull() && !jsonObj.get("functions").isJsonArray()) {
        throw new IllegalArgumentException(String.format("Expected the field `functions` to be an array in the JSON string but got `%s`", jsonObj.get("functions").toString()));
      }
      if ((jsonObj.get("system") != null && !jsonObj.get("system").isJsonNull()) && !jsonObj.get("system").isJsonPrimitive()) {
        throw new IllegalArgumentException(String.format("Expected the field `system` to be a primitive type in the JSON string but got `%s`", jsonObj.get("system").toString()));
      }
      // ensure the optional json data is an array if present
      if (jsonObj.get("stop") != null && !jsonObj.get("stop").isJsonNull() && !jsonObj.get("stop").isJsonArray()) {
        throw new IllegalArgumentException(String.format("Expected the field `stop` to be an array in the JSON string but got `%s`", jsonObj.get("stop").toString()));
      }
      if ((jsonObj.get("user_id") != null && !jsonObj.get("user_id").isJsonNull()) && !jsonObj.get("user_id").isJsonPrimitive()) {
        throw new IllegalArgumentException(String.format("Expected the field `user_id` to be a primitive type in the JSON string but got `%s`", jsonObj.get("user_id").toString()));
      }
  }

  public static class CustomTypeAdapterFactory implements TypeAdapterFactory {
    @SuppressWarnings("unchecked")
    @Override
    public <T> TypeAdapter<T> create(Gson gson, TypeToken<T> type) {
       if (!ChatRequest.class.isAssignableFrom(type.getRawType())) {
         return null; // this class only serializes 'ChatRequest' and its subtypes
       }
       final TypeAdapter<JsonElement> elementAdapter = gson.getAdapter(JsonElement.class);
       final TypeAdapter<ChatRequest> thisAdapter
                        = gson.getDelegateAdapter(this, TypeToken.get(ChatRequest.class));

       return (TypeAdapter<T>) new TypeAdapter<ChatRequest>() {
           @Override
           public void write(JsonWriter out, ChatRequest value) throws IOException {
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
           public ChatRequest read(JsonReader in) throws IOException {
             JsonElement jsonElement = elementAdapter.read(in);
             validateJsonElement(jsonElement);
             JsonObject jsonObj = jsonElement.getAsJsonObject();
             // store additional fields in the deserialized instance
             ChatRequest instance = thisAdapter.fromJsonTree(jsonObj);
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
  * Create an instance of ChatRequest given an JSON string
  *
  * @param jsonString JSON string
  * @return An instance of ChatRequest
  * @throws IOException if the JSON string is invalid with respect to ChatRequest
  */
  public static ChatRequest fromJson(String jsonString) throws IOException {
    return JSON.getGson().fromJson(jsonString, ChatRequest.class);
  }

 /**
  * Convert an instance of ChatRequest to an JSON string
  *
  * @return JSON string
  */
  public String toJson() {
    return JSON.getGson().toJson(this);
  }
}

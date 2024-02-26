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


package com.baidubce.sdc.sdk.model.qianfan;

import java.util.Objects;
import com.google.gson.annotations.SerializedName;

import java.io.IOException;
import com.google.gson.TypeAdapter;
import com.google.gson.JsonElement;
import com.google.gson.annotations.JsonAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;

/**
 * Gets or Sets ChatMessageRole
 */
@JsonAdapter(ChatMessageRole.Adapter.class)
public enum ChatMessageRole {
  
  USER("user"),
  
  ASSISTANT("assistant"),
  
  FUNCTION("function");

  private String value;

  ChatMessageRole(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }

  @Override
  public String toString() {
    return String.valueOf(value);
  }

  public static ChatMessageRole fromValue(String value) {
    for (ChatMessageRole b : ChatMessageRole.values()) {
      if (b.value.equals(value)) {
        return b;
      }
    }
    throw new IllegalArgumentException("Unexpected value '" + value + "'");
  }

  public static class Adapter extends TypeAdapter<ChatMessageRole> {
    @Override
    public void write(final JsonWriter jsonWriter, final ChatMessageRole enumeration) throws IOException {
      jsonWriter.value(enumeration.getValue());
    }

    @Override
    public ChatMessageRole read(final JsonReader jsonReader) throws IOException {
      String value = jsonReader.nextString();
      return ChatMessageRole.fromValue(value);
    }
  }

  public static void validateJsonElement(JsonElement jsonElement) throws IOException {
    String value = jsonElement.getAsString();
    ChatMessageRole.fromValue(value);
  }
}


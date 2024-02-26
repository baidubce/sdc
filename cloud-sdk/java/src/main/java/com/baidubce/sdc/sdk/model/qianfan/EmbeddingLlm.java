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
import com.baidubce.sdc.sdk.model.qianfan.EmbeddingLlmEnum;



import java.io.IOException;
import java.lang.reflect.Type;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonParseException;
import com.google.gson.TypeAdapter;
import com.google.gson.TypeAdapterFactory;
import com.google.gson.reflect.TypeToken;
import com.google.gson.JsonPrimitive;
import com.google.gson.annotations.JsonAdapter;
import com.google.gson.annotations.SerializedName;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import com.google.gson.JsonParseException;

import com.baidubce.sdc.sdk.JSON;
import com.baidubce.sdc.sdk.AbstractOpenApiSchema;

@javax.annotation.Generated(value = "org.openapitools.codegen.languages.BaiduCtsQianfanJavaCodegen")
public class EmbeddingLlm extends AbstractOpenApiSchema {
    private static final Logger log = Logger.getLogger(EmbeddingLlm.class.getName());

    public static class CustomTypeAdapterFactory implements TypeAdapterFactory {
        @SuppressWarnings("unchecked")
        @Override
        public <T> TypeAdapter<T> create(Gson gson, TypeToken<T> type) {
            if (!EmbeddingLlm.class.isAssignableFrom(type.getRawType())) {
                return null; // this class only serializes 'EmbeddingLlm' and its subtypes
            }
            final TypeAdapter<JsonElement> elementAdapter = gson.getAdapter(JsonElement.class);
            final TypeAdapter<EmbeddingLlmEnum> adapterEmbeddingLlmEnum = gson.getDelegateAdapter(this, TypeToken.get(EmbeddingLlmEnum.class));
            final TypeAdapter<String> adapterString = gson.getDelegateAdapter(this, TypeToken.get(String.class));

            return (TypeAdapter<T>) new TypeAdapter<EmbeddingLlm>() {
                @Override
                public void write(JsonWriter out, EmbeddingLlm value) throws IOException {
                    if (value == null || value.getActualInstance() == null) {
                        elementAdapter.write(out, null);
                        return;
                    }

                    // check if the actual instance is of the type `EmbeddingLlmEnum`
                    if (value.getActualInstance() instanceof EmbeddingLlmEnum) {
                      JsonElement element = adapterEmbeddingLlmEnum.toJsonTree((EmbeddingLlmEnum)value.getActualInstance());
                      elementAdapter.write(out, element);
                      return;
                    }
                    // check if the actual instance is of the type `String`
                    if (value.getActualInstance() instanceof String) {
                      JsonPrimitive primitive = adapterString.toJsonTree((String)value.getActualInstance()).getAsJsonPrimitive();
                      elementAdapter.write(out, primitive);
                      return;
                    }
                    throw new IOException("Failed to serialize as the type doesn't match oneOf schemas: EmbeddingLlmEnum, String");
                }

                @Override
                public EmbeddingLlm read(JsonReader in) throws IOException {
                    Object deserialized = null;
                    JsonElement jsonElement = elementAdapter.read(in);

                    int match = 0;
                    ArrayList<String> errorMessages = new ArrayList<>();
                    TypeAdapter actualAdapter = elementAdapter;

                    // deserialize EmbeddingLlmEnum
                    try {
                      // validate the JSON object to see if any exception is thrown
                      EmbeddingLlmEnum.validateJsonElement(jsonElement);
                      actualAdapter = adapterEmbeddingLlmEnum;
                      match++;
                      log.log(Level.FINER, "Input data matches schema 'EmbeddingLlmEnum'");
                    } catch (Exception e) {
                      // deserialization failed, continue
                      errorMessages.add(String.format("Deserialization for EmbeddingLlmEnum failed with `%s`.", e.getMessage()));
                      log.log(Level.FINER, "Input data does not match schema 'EmbeddingLlmEnum'", e);
                    }
                    // deserialize String
                    try {
                      // validate the JSON object to see if any exception is thrown
                      if(!jsonElement.getAsJsonPrimitive().isString()) {
                        throw new IllegalArgumentException(String.format("Expected json element to be of type String in the JSON string but got `%s`", jsonElement.toString()));
                      }
                      actualAdapter = adapterString;
                      match++;
                      log.log(Level.FINER, "Input data matches schema 'String'");
                    } catch (Exception e) {
                      // deserialization failed, continue
                      errorMessages.add(String.format("Deserialization for String failed with `%s`.", e.getMessage()));
                      log.log(Level.FINER, "Input data does not match schema 'String'", e);
                    }

                    if (match == 1) {
                        EmbeddingLlm ret = new EmbeddingLlm();
                        ret.setActualInstance(actualAdapter.fromJsonTree(jsonElement));
                        return ret;
                    }

                    throw new IOException(String.format("Failed deserialization for EmbeddingLlm: %d classes match result, expected 1. Detailed failure message for oneOf schemas: %s. JSON: %s", match, errorMessages, jsonElement.toString()));
                }
            }.nullSafe();
        }
    }

    // store a list of schema names defined in oneOf
    public static final Map<String, Class<?>> schemas = new HashMap<String, Class<?>>();

    public EmbeddingLlm() {
        super("oneOf", Boolean.FALSE);
    }

    public EmbeddingLlm(EmbeddingLlmEnum o) {
        super("oneOf", Boolean.FALSE);
        setActualInstance(o);
    }

    public EmbeddingLlm(String o) {
        super("oneOf", Boolean.FALSE);
        setActualInstance(o);
    }

    static {
        schemas.put("EmbeddingLlmEnum", EmbeddingLlmEnum.class);
        schemas.put("String", String.class);
    }

    @Override
    public Map<String, Class<?>> getSchemas() {
        return EmbeddingLlm.schemas;
    }

    /**
     * Set the instance that matches the oneOf child schema, check
     * the instance parameter is valid against the oneOf child schemas:
     * EmbeddingLlmEnum, String
     *
     * It could be an instance of the 'oneOf' schemas.
     */
    @Override
    public void setActualInstance(Object instance) {
        if (instance instanceof EmbeddingLlmEnum) {
            super.setActualInstance(instance);
            return;
        }

        if (instance instanceof String) {
            super.setActualInstance(instance);
            return;
        }

        throw new RuntimeException("Invalid instance type. Must be EmbeddingLlmEnum, String");
    }

    /**
     * Get the actual instance, which can be the following:
     * EmbeddingLlmEnum, String
     *
     * @return The actual instance (EmbeddingLlmEnum, String)
     */
    @Override
    public Object getActualInstance() {
        return super.getActualInstance();
    }

    /**
     * Get the actual instance of `EmbeddingLlmEnum`. If the actual instance is not `EmbeddingLlmEnum`,
     * the ClassCastException will be thrown.
     *
     * @return The actual instance of `EmbeddingLlmEnum`
     * @throws ClassCastException if the instance is not `EmbeddingLlmEnum`
     */
    public EmbeddingLlmEnum getEmbeddingLlmEnum() throws ClassCastException {
        return (EmbeddingLlmEnum)super.getActualInstance();
    }
    /**
     * Get the actual instance of `String`. If the actual instance is not `String`,
     * the ClassCastException will be thrown.
     *
     * @return The actual instance of `String`
     * @throws ClassCastException if the instance is not `String`
     */
    public String getString() throws ClassCastException {
        return (String)super.getActualInstance();
    }

 /**
  * Validates the JSON Element and throws an exception if issues found
  *
  * @param jsonElement JSON Element
  * @throws IOException if the JSON Element is invalid with respect to EmbeddingLlm
  */
  public static void validateJsonElement(JsonElement jsonElement) throws IOException {
    // validate oneOf schemas one by one
    int validCount = 0;
    ArrayList<String> errorMessages = new ArrayList<>();
    // validate the json string with EmbeddingLlmEnum
    try {
      EmbeddingLlmEnum.validateJsonElement(jsonElement);
      validCount++;
    } catch (Exception e) {
      errorMessages.add(String.format("Deserialization for EmbeddingLlmEnum failed with `%s`.", e.getMessage()));
      // continue to the next one
    }
    // validate the json string with String
    try {
      if(!jsonElement.getAsJsonPrimitive().isString()) {
        throw new IllegalArgumentException(String.format("Expected json element to be of type String in the JSON string but got `%s`", jsonElement.toString()));
      }
      validCount++;
    } catch (Exception e) {
      errorMessages.add(String.format("Deserialization for String failed with `%s`.", e.getMessage()));
      // continue to the next one
    }
    if (validCount != 1) {
      throw new IOException(String.format("The JSON string is invalid for EmbeddingLlm with oneOf schemas: EmbeddingLlmEnum, String. %d class(es) match the result, expected 1. Detailed failure message for oneOf schemas: %s. JSON: %s", validCount, errorMessages, jsonElement.toString()));
    }
  }

 /**
  * Create an instance of EmbeddingLlm given an JSON string
  *
  * @param jsonString JSON string
  * @return An instance of EmbeddingLlm
  * @throws IOException if the JSON string is invalid with respect to EmbeddingLlm
  */
  public static EmbeddingLlm fromJson(String jsonString) throws IOException {
    return JSON.getGson().fromJson(jsonString, EmbeddingLlm.class);
  }

 /**
  * Convert an instance of EmbeddingLlm to an JSON string
  *
  * @return JSON string
  */
  public String toJson() {
    return JSON.getGson().toJson(this);
  }
}


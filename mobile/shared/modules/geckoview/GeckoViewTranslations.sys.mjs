/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const lazy = {};

ChromeUtils.defineESModuleGetters(lazy, {
  TranslationsParent: "resource://gre/actors/TranslationsParent.sys.mjs",
  TranslationsUtils:
    "chrome://global/content/translations/TranslationsUtils.mjs",
});

import { GeckoViewModule } from "resource://gre/modules/GeckoViewModule.sys.mjs";

export class GeckoViewTranslations extends GeckoViewModule {
  onInit() {
    debug`onInit`;
    this.registerListener([
      "GeckoView:Translations:Translate",
      "GeckoView:Translations:RestorePage",
      "GeckoView:Translations:GetNeverTranslateSite",
      "GeckoView:Translations:SetNeverTranslateSite",
    ]);
  }

  onEnable() {
    debug`onEnable`;
    this.window.addEventListener("TranslationsParent:OfferTranslation", this);
    this.window.addEventListener("TranslationsParent:LanguageState", this);
  }

  onDisable() {
    debug`onDisable`;
    this.window.removeEventListener(
      "TranslationsParent:OfferTranslation",
      this
    );
    this.window.removeEventListener("TranslationsParent:LanguageState", this);
  }

  onEvent(aEvent, aData, aCallback) {
    debug`onEvent: event=${aEvent}, data=${aData}`;
    switch (aEvent) {
      case "GeckoView:Translations:Translate": {
        try {
          const { sourceLanguage, targetLanguage } = aData;

          if (
            lazy.TranslationsUtils.isLangTagValid(sourceLanguage) &&
            lazy.TranslationsUtils.isLangTagValid(targetLanguage)
          ) {
            this.getActor("Translations")
              .translate(
                {
                  sourceLanguage,
                  targetLanguage,
                  // Model variants are not currently supported. See Bug 1943444.
                },
                /* reportAsAutoTranslate */ false
              )
              .then(
                () => aCallback.onSuccess(),
                error => aCallback.onError(`Could not translate: ${error}`)
              );
          } else {
            aCallback.onError(
              `The language tag ${sourceLanguage} or ${targetLanguage} is not valid.`
            );
          }
        } catch (error) {
          aCallback.onError(`Could not translate: ${error}`);
        }
        break;
      }

      case "GeckoView:Translations:RestorePage":
        try {
          this.getActor("Translations").restorePage();
          aCallback.onSuccess();
        } catch (error) {
          aCallback.onError(`Could not restore page: ${error}`);
        }
        break;

      case "GeckoView:Translations:GetNeverTranslateSite":
        try {
          const value =
            this.getActor("Translations").shouldNeverTranslateSite();
          aCallback.onSuccess(value);
        } catch (error) {
          aCallback.onError(`Could not set site setting: ${error}`);
        }
        break;

      case "GeckoView:Translations:SetNeverTranslateSite":
        try {
          this.getActor("Translations").setNeverTranslateSitePermissions(
            aData.neverTranslate
          );
          aCallback.onSuccess();
        } catch (error) {
          aCallback.onError(`Could not set site setting: ${error}`);
        }
        break;
    }
  }

  handleEvent(aEvent) {
    debug`handleEvent: ${aEvent.type}`;
    switch (aEvent.type) {
      case "TranslationsParent:OfferTranslation":
        this.eventDispatcher.sendRequest({
          type: "GeckoView:Translations:Offer",
        });
        break;
      case "TranslationsParent:LanguageState": {
        const {
          detectedLanguages,
          requestedLanguagePair,
          hasVisibleChange,
          error,
          isEngineReady,
        } = aEvent.detail.actor.languageState;

        const data = {
          detectedLanguages,
          requestedLanguagePair,
          hasVisibleChange,
          error,
          isEngineReady,
        };

        this.eventDispatcher.sendRequest({
          type: "GeckoView:Translations:StateChange",
          data,
        });

        break;
      }
    }
  }
}

// Runtime functionality
export const GeckoViewTranslationsSettings = {
  // Helper method for retrieving language setting state and corresponding string name.
  _getLanguageSettingName(langTag) {
    const isAlways = lazy.TranslationsParent.shouldAlwaysTranslateLanguage({
      docLangTag: langTag,
      userLangTag: new Intl.Locale(Services.locale.appLocaleAsBCP47).language,
    });
    const isNever =
      lazy.TranslationsParent.shouldNeverTranslateLanguage(langTag);
    // Default setting is offer.
    let setting = "offer";

    if (isAlways & !isNever) {
      setting = "always";
    }

    if (isNever & !isAlways) {
      setting = "never";
    }
    return setting;
  },
  /* eslint-disable complexity */
  async onEvent(aEvent, aData, aCallback) {
    debug`onEvent ${aEvent} ${aData}`;

    switch (aEvent) {
      case "GeckoView:Translations:IsTranslationEngineSupported": {
        try {
          aCallback.onSuccess(
            lazy.TranslationsParent.getIsTranslationsEngineSupported()
          );
        } catch (error) {
          aCallback.onError(
            `An issue occurred while checking the translations engine: ${error}`
          );
        }
        return;
      }
      case "GeckoView:Translations:PreferredLanguages": {
        aCallback.onSuccess({
          preferredLanguages: lazy.TranslationsParent.getPreferredLanguages(),
        });
        return;
      }
      case "GeckoView:Translations:ManageModel": {
        const { language, operation, operationLevel } = aData;
        if (operation === "delete") {
          if (operationLevel === "all") {
            lazy.TranslationsParent.deleteAllLanguageFiles().then(
              function () {
                aCallback.onSuccess();
              },
              function (error) {
                aCallback.onError(
                  `COULD_NOT_DELETE - An issue occurred while deleting all language files: ${error}`
                );
              }
            );
            return;
          }
          if (operationLevel === "language") {
            if (language === undefined) {
              aCallback.onError(
                `LANGUAGE_REQUIRED - A specified language is required language level operations.`
              );
              return;
            }
            lazy.TranslationsParent.deleteLanguageFiles(language).then(
              function () {
                aCallback.onSuccess();
              },
              function (error) {
                aCallback.onError(
                  `COULD_NOT_DELETE - An issue occurred while deleting a language file: ${error}`
                );
              }
            );
          }
          if (operationLevel === "cache") {
            await lazy.TranslationsParent.deleteCachedLanguageFiles().then(
              function () {
                aCallback.onSuccess();
              },
              function (error) {
                aCallback.onError(
                  `COULD_NOT_DELETE - An issue occurred while deleting the cache: ${error}`
                );
              }
            );
          }
        } else if (operation === "download") {
          if (operationLevel === "all") {
            lazy.TranslationsParent.downloadAllFiles().then(
              function () {
                aCallback.onSuccess();
              },
              function (error) {
                aCallback.onError(
                  `COULD_NOT_DOWNLOAD - An issue occurred while downloading all language files: ${error}`
                );
              }
            );
            return;
          }
          if (operationLevel === "language") {
            if (language === undefined) {
              aCallback.onError(
                `LANGUAGE_REQUIRED - A specified language is required language level operations.`
              );
              return;
            }
            lazy.TranslationsParent.downloadLanguageFiles(language).then(
              function () {
                aCallback.onSuccess();
              },
              function (error) {
                aCallback.onError(
                  `COULD_NOT_DOWNLOAD - An issue occurred while downloading a language files: ${error}`
                );
              }
            );
          }
          if (operationLevel === "cache") {
            aCallback.onError(
              `COULD_NOT_DOWNLOAD - Downloading the cache is not a valid option. Please check the parameters and try again.
               Language: ${language}, Operation: ${operation}, Operation Level: ${operationLevel}`
            );
          }
        } else {
          aCallback.onError(
            `ERROR_UNKNOWN - The request to manage models appears to be malformed. Please check the parameters and try again.
            Language: ${language}, Operation: ${operation}, Operation Level: ${operationLevel}`
          );
        }
        break;
      }
      case "GeckoView:Translations:TranslationInformation": {
        if (
          Cu.isInAutomation &&
          Services.prefs.getBoolPref(
            "browser.translations.geckoview.enableAllTestMocks",
            false
          )
        ) {
          const mockResult = {
            languagePairs: [
              { sourceLanguage: "en", targetLanguage: "es" },
              { sourceLanguage: "es", targetLanguage: "en" },
              { sourceLanguage: "en", targetLanguage: "es", variant: "base" },
            ],
            sourceLanguages: [
              { langTag: "en", langTagKey: "en", displayName: "English" },
              { langTag: "es", langTagKey: "es", displayName: "Spanish" },
            ],
            targetLanguages: [
              { langTag: "en", langTagKey: "en", displayName: "English" },
              { langTag: "es", langTagKey: "en", displayName: "Spanish" },
            ],
          };
          aCallback.onSuccess(mockResult);
          return;
        }

        lazy.TranslationsParent.getSupportedLanguages().then(
          function (value) {
            aCallback.onSuccess(value);
          },
          function (error) {
            aCallback.onError(
              `Could not retrieve requested information: ${error}`
            );
          }
        );
        break;
      }
      case "GeckoView:Translations:ModelInformation": {
        if (
          Cu.isInAutomation &&
          Services.prefs.getBoolPref(
            "browser.translations.geckoview.enableAllTestMocks",
            false
          )
        ) {
          const mockResult = {
            models: [
              {
                langTag: "es",
                displayName: "Spanish",
                isDownloaded: false,
                size: 12345,
              },
              {
                langTag: "de",
                displayName: "German",
                isDownloaded: false,
                size: 12345,
              },
            ],
          };
          aCallback.onSuccess(mockResult);
          return;
        }

        // Helper function to process remote server records size and download state for GV use
        async function _processLanguageModelData(language, remoteRecords) {
          // Aggregate size of downloads, e.g., one language has many model binary files
          let size = 0;
          remoteRecords.forEach(item => {
            size += parseInt(item.attachment.size);
          });
          // Check if required files are downloaded
          const isDownloaded =
            await lazy.TranslationsParent.hasAllFilesForLanguage(
              language.langTag
            );
          const model = {
            langTag: language.langTag,
            displayName: language.displayName,
            isDownloaded,
            size,
          };
          return model;
        }

        // Main call to toolkit
        lazy.TranslationsParent.getSupportedLanguages().then(
          // Retrieve supported languages
          async function (supportedLanguages) {
            // Get language display information,
            const languageList =
              lazy.TranslationsParent.getLanguageList(supportedLanguages);
            const results = [];
            const pivotIsDownloaded =
              await lazy.TranslationsParent.hasAllFilesForLanguage(
                lazy.TranslationsParent.PIVOT_LANGUAGE
              );

            // For each language, process the related remote server model records
            languageList.forEach(language => {
              // No need to include the pivot in the download size, once it has been downloaded.
              const recordsResult =
                lazy.TranslationsParent.getRecordsForTranslatingToAndFromAppLanguage(
                  language.langTag,
                  /* includePivotRecords */ !pivotIsDownloaded
                ).then(
                  async function (records) {
                    return _processLanguageModelData(language, records);
                  },
                  function (recordError) {
                    aCallback.onError(
                      `An issue occurred while aggregating information: ${recordError}`
                    );
                  }
                );
              results.push(recordsResult);
            });
            // Aggregate records
            Promise.all(results).then(models => {
              const response = [];
              models.forEach(item => {
                // Ensures unactionable models do not appear in the list
                if (parseInt(item.size) !== 0) {
                  response.push(item);
                }
              });
              aCallback.onSuccess({ models: response });
            });
          },
          function (languageError) {
            aCallback.onError(
              `An issue occurred while retrieving the supported languages: ${languageError}`
            );
          }
        );
        break;
      }

      case "GeckoView:Translations:GetLanguageSetting": {
        if (
          Cu.isInAutomation &&
          Services.prefs.getBoolPref(
            "browser.translations.geckoview.enableAllTestMocks",
            false
          )
        ) {
          aCallback.onSuccess("always");
          return;
        }

        try {
          const setting = this._getLanguageSettingName(aData.language);
          aCallback.onSuccess(setting);
        } catch (error) {
          aCallback.onError(`Could not get language setting: ${error}`);
        }
        break;
      }

      case "GeckoView:Translations:GetLanguageSettings": {
        if (
          Cu.isInAutomation &&
          Services.prefs.getBoolPref(
            "browser.translations.geckoview.enableAllTestMocks",
            false
          )
        ) {
          const mockResult = {
            settings: [
              { langTag: "fr", displayName: "French", setting: "always" },
              { langTag: "de", displayName: "German", setting: "offer" },
              { langTag: "es", displayName: "Spanish", setting: "never" },
            ],
          };
          aCallback.onSuccess(mockResult);
          return;
        }

        lazy.TranslationsParent.getSupportedLanguages().then(
          function (supportedLanguages) {
            const languageList =
              lazy.TranslationsParent.getLanguageList(supportedLanguages);

            languageList.forEach(language => {
              language.setting = this._getLanguageSettingName(language.langTag);
            });

            aCallback.onSuccess({ settings: languageList });
          }.bind(this),
          function (error) {
            aCallback.onError(
              `Could not retrieve language setting information: ${error}`
            );
          }
        );
        break;
      }

      case "GeckoView:Translations:SetLanguageSettings": {
        let { language, languageSetting } = aData;
        languageSetting = languageSetting.toLowerCase();

        if (!lazy.TranslationsUtils.isLangTagValid(aData.language)) {
          aCallback.onError(`The language tag ${language} is not valid.`);
          return;
        }

        const ALWAYS = lazy.TranslationsParent.ALWAYS_TRANSLATE_LANGS_PREF;
        const NEVER = lazy.TranslationsParent.NEVER_TRANSLATE_LANGS_PREF;

        switch (languageSetting) {
          case "always": {
            try {
              lazy.TranslationsParent.removeLangTagFromPref(language, NEVER);
              lazy.TranslationsParent.addLangTagToPref(language, ALWAYS);
              aCallback.onSuccess();
            } catch (error) {
              aCallback.onError(
                `Could not set language preference to always: ${error}`
              );
            }
            break;
          }

          case "never": {
            try {
              lazy.TranslationsParent.removeLangTagFromPref(language, ALWAYS);
              lazy.TranslationsParent.addLangTagToPref(language, NEVER);
              aCallback.onSuccess();
            } catch (error) {
              aCallback.onError(
                `Could not set language preference to never: ${error}`
              );
            }
            break;
          }

          case "offer": {
            try {
              // Reverting to default settings, so ensure nothing is set.
              lazy.TranslationsParent.removeLangTagFromPref(language, NEVER);
              lazy.TranslationsParent.removeLangTagFromPref(language, ALWAYS);
              aCallback.onSuccess();
            } catch (error) {
              aCallback.onError(
                `Could not set language preference to offer: ${error}`
              );
            }
            break;
          }
        }
        break;
      }

      case "GeckoView:Translations:GetNeverTranslateSpecifiedSites":
        try {
          const neverTranslateList =
            lazy.TranslationsParent.listNeverTranslateSites();
          aCallback.onSuccess({ sites: neverTranslateList });
        } catch (error) {
          aCallback.onError(
            `Could not get list of never translate sites: ${error}`
          );
        }
        break;

      case "GeckoView:Translations:SetNeverTranslateSpecifiedSite":
        try {
          lazy.TranslationsParent.setNeverTranslateSiteByOrigin(
            aData.neverTranslate,
            aData.origin
          );
          aCallback.onSuccess();
        } catch (error) {
          aCallback.onError(
            `Could not set never translate site setting: ${error}`
          );
        }
        break;
      case "GeckoView:Translations:GetTranslateDownloadSize": {
        if (
          Cu.isInAutomation &&
          Services.prefs.getBoolPref(
            "browser.translations.geckoview.enableAllTestMocks",
            false
          )
        ) {
          aCallback.onSuccess({ bytes: 1234567 });
          return;
        }

        const fromLangValid = lazy.TranslationsUtils.isLangTagValid(
          aData.fromLanguage
        );
        const toLangValid = lazy.TranslationsUtils.isLangTagValid(
          aData.toLanguage
        );
        if (!fromLangValid || !toLangValid) {
          aCallback.onError(
            `The language tag ${aData.fromLanguage} or ${aData.toLanguage} is not valid.`
          );
          return;
        }

        lazy.TranslationsParent.getExpectedTranslationDownloadSize(
          aData.fromLanguage,
          aData.toLanguage
        ).then(
          function (bytes) {
            aCallback.onSuccess({ bytes });
          },
          function (error) {
            aCallback.onError(`Could not get the download size: ${error}`);
          }
        );
        break;
      }
    }
  },
};

const { debug, warn } = GeckoViewTranslations.initLogging(
  "GeckoViewTranslations"
);

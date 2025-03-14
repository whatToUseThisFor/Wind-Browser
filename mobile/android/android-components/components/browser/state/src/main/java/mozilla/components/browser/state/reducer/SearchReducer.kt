/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

package mozilla.components.browser.state.reducer

import mozilla.components.browser.state.action.SearchAction
import mozilla.components.browser.state.search.SearchEngine
import mozilla.components.browser.state.state.BrowserState
import mozilla.components.browser.state.state.SearchState

internal object SearchReducer {
    /**
     * [SearchAction] Reducer function for modifying [SearchState].
     */
    fun reduce(state: BrowserState, action: SearchAction): BrowserState {
        return when (action) {
            is SearchAction.RefreshSearchEnginesAction -> state // This is handled in [RegionMiddleware].
            is SearchAction.ApplicationSearchEnginesLoaded -> state.setApplicationEngines(action)
            is SearchAction.SetSearchEnginesAction -> state.setSearchEngines(action)
            is SearchAction.SetRegionAction -> state.setRegion(action)
            is SearchAction.UpdateCustomSearchEngineAction -> state.updateCustomSearchEngine(action)
            is SearchAction.RemoveCustomSearchEngineAction -> state.removeSearchEngine(action)
            is SearchAction.SelectSearchEngineAction -> state.selectSearchEngine(action)
            is SearchAction.ShowSearchEngineAction -> state.maybeShowSearchEngine(action)
            is SearchAction.HideSearchEngineAction -> state.hideSearchEngine(action)
            is SearchAction.AddAdditionalSearchEngineAction -> state.addAdditionalSearchEngine(action)
            is SearchAction.RemoveAdditionalSearchEngineAction -> state.removeAdditionalSearchEngine(action)
            is SearchAction.UpdateDisabledSearchEngineIdsAction ->
                state.updateDisabledSearchEngineIds(action)
            is SearchAction.RestoreHiddenSearchEnginesAction -> state.restoreHiddenSearchEngines()
        }
    }
}

private fun BrowserState.setApplicationEngines(
    action: SearchAction.ApplicationSearchEnginesLoaded,
): BrowserState {
    return copy(
        search = search.copy(
            applicationSearchEngines = action.applicationSearchEngines,
        ),
    )
}

private fun BrowserState.setSearchEngines(
    action: SearchAction.SetSearchEnginesAction,
): BrowserState {
    return copy(
        search = search.copy(
            regionSearchEngines = action.regionSearchEngines,
            customSearchEngines = action.customSearchEngines,
            userSelectedSearchEngineId = action.userSelectedSearchEngineId,
            userSelectedSearchEngineName = action.userSelectedSearchEngineName,
            regionDefaultSearchEngineId = action.regionDefaultSearchEngineId,
            hiddenSearchEngines = action.hiddenSearchEngines,
            disabledSearchEngineIds = action.disabledSearchEngineIds,
            additionalSearchEngines = action.additionalSearchEngines,
            additionalAvailableSearchEngines = action.additionalAvailableSearchEngines,
            regionSearchEnginesOrder = action.regionSearchEnginesOrder,
            complete = true,
        ),
    )
}

private fun BrowserState.setRegion(
    action: SearchAction.SetRegionAction,
): BrowserState {
    return copy(
        search = search.copy(
            region = action.regionState,
        ),
    )
}

private fun BrowserState.updateCustomSearchEngine(
    action: SearchAction.UpdateCustomSearchEngineAction,
): BrowserState {
    val searchEngines = search.customSearchEngines
    val index = searchEngines.indexOfFirst { searchEngine -> searchEngine.id == action.searchEngine.id }

    val updatedSearchEngines = if (index != -1) {
        searchEngines.subList(0, index) + action.searchEngine + searchEngines.subList(index + 1, searchEngines.size)
    } else {
        searchEngines + action.searchEngine
    }

    return copy(
        search = search.copy(
            customSearchEngines = updatedSearchEngines,
        ),
    )
}

private fun BrowserState.removeSearchEngine(
    action: SearchAction.RemoveCustomSearchEngineAction,
): BrowserState {
    return copy(
        search = search.copy(
            customSearchEngines = search.customSearchEngines.filter { it.id != action.searchEngineId },
        ),
    )
}

private fun BrowserState.selectSearchEngine(
    action: SearchAction.SelectSearchEngineAction,
): BrowserState {
    // We allow setting an ID of a search engine that is not in the state since loading the search
    // engines may happen asynchronously and the search engine may not be loaded yet at this point.
    return copy(
        search = search.copy(
            userSelectedSearchEngineId = action.searchEngineId,
            userSelectedSearchEngineName = action.searchEngineName,
        ),
    )
}

private fun BrowserState.maybeShowSearchEngine(
    action: SearchAction.ShowSearchEngineAction,
): BrowserState {
    val searchEngine = search.hiddenSearchEngines.find { searchEngine -> searchEngine.id == action.searchEngineId }
    return if (searchEngine != null) {
        return showSearchEngine(searchEngine)
    } else {
        this
    }
}

private fun BrowserState.showSearchEngine(
    searchEngine: SearchEngine,
): BrowserState {
    return copy(
        search = search.copy(
            hiddenSearchEngines = search.hiddenSearchEngines - searchEngine,
            regionSearchEngines = (search.regionSearchEngines + searchEngine).sortedBy {
                search.regionSearchEnginesOrder.indexOf(it.id)
            },
        ),
    )
}

private fun BrowserState.hideSearchEngine(
    action: SearchAction.HideSearchEngineAction,
): BrowserState {
    val searchEngine = search.regionSearchEngines.find { searchEngine -> searchEngine.id == action.searchEngineId }

    return if (searchEngine != null) {
        copy(
            search = search.copy(
                regionSearchEngines = search.regionSearchEngines - searchEngine,
                hiddenSearchEngines = search.hiddenSearchEngines + searchEngine,
            ),
        )
    } else {
        this
    }
}

private fun BrowserState.addAdditionalSearchEngine(
    action: SearchAction.AddAdditionalSearchEngineAction,
): BrowserState {
    val searchEngine = search.additionalAvailableSearchEngines.find { searchEngine ->
        searchEngine.id == action.searchEngineId
    }

    return if (searchEngine != null) {
        copy(
            search = search.copy(
                additionalSearchEngines = search.additionalSearchEngines + searchEngine,
                additionalAvailableSearchEngines = search.additionalAvailableSearchEngines - searchEngine,
            ),
        )
    } else {
        this
    }
}

private fun BrowserState.removeAdditionalSearchEngine(
    action: SearchAction.RemoveAdditionalSearchEngineAction,
): BrowserState {
    val searchEngine = search.additionalSearchEngines.find { searchEngine ->
        searchEngine.id == action.searchEngineId
    }

    return if (searchEngine != null) {
        copy(
            search = search.copy(
                additionalAvailableSearchEngines = search.additionalAvailableSearchEngines + searchEngine,
                additionalSearchEngines = search.additionalSearchEngines - searchEngine,
            ),
        )
    } else {
        this
    }
}

private fun BrowserState.updateDisabledSearchEngineIds(
    action: SearchAction.UpdateDisabledSearchEngineIdsAction,
): BrowserState {
    val updatedDisabledSearchEngineShortcutIds = if (action.isEnabled) {
        search.disabledSearchEngineIds - action.searchEngineId
    } else {
        search.disabledSearchEngineIds + action.searchEngineId
    }

    return copy(
        search = search.copy(
            disabledSearchEngineIds = updatedDisabledSearchEngineShortcutIds,
        ),
    )
}

private fun BrowserState.restoreHiddenSearchEngines(): BrowserState {
    return search.hiddenSearchEngines.fold(this) { state, engine ->
        state.showSearchEngine(engine)
    }
}

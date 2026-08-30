export { SearchCache } from "./cache";
export {
    SearchDropdown,
    SearchEmpty,
    SearchInput,
    SearchLoading,
    SearchRecent,
    SearchResults,
    SearchSuggestions,
    SearchTrending,
} from "./components";
export {
    useClickOutside,
    useDebounce,
    useSearch,
    useSearchHome,
    useSearchKeyboard,
    useSearchShortcuts,
} from "./hooks";
export { SearchService } from "./services";

export type {
    AdvertisementSearchResult,
    AutocompleteSuggestion,
    BeatSearchRequest,
    BeatSearchResult,
    ProducerSearchResult,
    RecentSearch,
    SearchEntityType,
    SearchRequest,
    SearchResponse,
    SearchResultItem,
    StudioSearchRequest,
    StudioSearchResult,
    TrendingSearch,
} from "./types/search";

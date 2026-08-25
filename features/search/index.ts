export { default as SearchCache } from "./cache/SearchCache";

export { default as SearchDropdown } from "./components/SearchDropdown";
export { default as SearchEmpty } from "./components/SearchEmpty";
export { default as SearchInput } from "./components/SearchInput";
export { default as SearchLoading } from "./components/SearchLoading";
export { default as SearchRecent } from "./components/SearchRecent";
export { default as SearchResults } from "./components/SearchResults";
export { default as SearchSuggestions } from "./components/SearchSuggestions";
export { default as SearchTrending } from "./components/SearchTrending";

export { default as useClickOutside } from "./hooks/useClickOutside";
export { default as useDebounce } from "./hooks/useDebounce";
export { default as useSearch } from "./hooks/useSearch";
export { default as useSearchHome } from "./hooks/useSearchHome";
export { useSearchKeyboard } from "./hooks/useSearchKeyboard";
export { useSearchShortcuts } from "./hooks/useSearchShortcuts";

export { default as SearchService } from "./services/search.service";

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

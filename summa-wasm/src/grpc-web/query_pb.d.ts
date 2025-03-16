// package: summa.proto
// file: query.proto

import * as jspb from "google-protobuf";

export class TermFieldMapperConfig extends jspb.Message {
  clearFieldsList(): void;
  getFieldsList(): Array<string>;
  setFieldsList(value: Array<string>): void;
  addFields(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TermFieldMapperConfig.AsObject;
  static toObject(includeInstance: boolean, msg: TermFieldMapperConfig): TermFieldMapperConfig.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TermFieldMapperConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TermFieldMapperConfig;
  static deserializeBinaryFromReader(message: TermFieldMapperConfig, reader: jspb.BinaryReader): TermFieldMapperConfig;
}

export namespace TermFieldMapperConfig {
  export type AsObject = {
    fieldsList: Array<string>,
  }
}

export class MatchQueryBooleanShouldMode extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MatchQueryBooleanShouldMode.AsObject;
  static toObject(includeInstance: boolean, msg: MatchQueryBooleanShouldMode): MatchQueryBooleanShouldMode.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MatchQueryBooleanShouldMode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MatchQueryBooleanShouldMode;
  static deserializeBinaryFromReader(message: MatchQueryBooleanShouldMode, reader: jspb.BinaryReader): MatchQueryBooleanShouldMode;
}

export namespace MatchQueryBooleanShouldMode {
  export type AsObject = {
  }
}

export class MatchQueryDisjuctionMaxMode extends jspb.Message {
  getTieBreaker(): number;
  setTieBreaker(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MatchQueryDisjuctionMaxMode.AsObject;
  static toObject(includeInstance: boolean, msg: MatchQueryDisjuctionMaxMode): MatchQueryDisjuctionMaxMode.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MatchQueryDisjuctionMaxMode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MatchQueryDisjuctionMaxMode;
  static deserializeBinaryFromReader(message: MatchQueryDisjuctionMaxMode, reader: jspb.BinaryReader): MatchQueryDisjuctionMaxMode;
}

export namespace MatchQueryDisjuctionMaxMode {
  export type AsObject = {
    tieBreaker: number,
  }
}

export class ExactMatchesPromoter extends jspb.Message {
  getSlop(): number;
  setSlop(value: number): void;

  hasBoost(): boolean;
  clearBoost(): void;
  getBoost(): number;
  setBoost(value: number): void;

  clearFieldsList(): void;
  getFieldsList(): Array<string>;
  setFieldsList(value: Array<string>): void;
  addFields(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExactMatchesPromoter.AsObject;
  static toObject(includeInstance: boolean, msg: ExactMatchesPromoter): ExactMatchesPromoter.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExactMatchesPromoter, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExactMatchesPromoter;
  static deserializeBinaryFromReader(message: ExactMatchesPromoter, reader: jspb.BinaryReader): ExactMatchesPromoter;
}

export namespace ExactMatchesPromoter {
  export type AsObject = {
    slop: number,
    boost: number,
    fieldsList: Array<string>,
  }
}

export class NerMatchesPromoter extends jspb.Message {
  hasBoost(): boolean;
  clearBoost(): void;
  getBoost(): number;
  setBoost(value: number): void;

  clearFieldsList(): void;
  getFieldsList(): Array<string>;
  setFieldsList(value: Array<string>): void;
  addFields(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NerMatchesPromoter.AsObject;
  static toObject(includeInstance: boolean, msg: NerMatchesPromoter): NerMatchesPromoter.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NerMatchesPromoter, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NerMatchesPromoter;
  static deserializeBinaryFromReader(message: NerMatchesPromoter, reader: jspb.BinaryReader): NerMatchesPromoter;
}

export namespace NerMatchesPromoter {
  export type AsObject = {
    boost: number,
    fieldsList: Array<string>,
  }
}

export class MorphologyConfig extends jspb.Message {
  hasDeriveTensesCoefficient(): boolean;
  clearDeriveTensesCoefficient(): void;
  getDeriveTensesCoefficient(): number;
  setDeriveTensesCoefficient(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MorphologyConfig.AsObject;
  static toObject(includeInstance: boolean, msg: MorphologyConfig): MorphologyConfig.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MorphologyConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MorphologyConfig;
  static deserializeBinaryFromReader(message: MorphologyConfig, reader: jspb.BinaryReader): MorphologyConfig;
}

export namespace MorphologyConfig {
  export type AsObject = {
    deriveTensesCoefficient: number,
  }
}

export class QueryParserConfig extends jspb.Message {
  getFieldAliasesMap(): jspb.Map<string, string>;
  clearFieldAliasesMap(): void;
  getFieldBoostsMap(): jspb.Map<string, number>;
  clearFieldBoostsMap(): void;
  getTermFieldMapperConfigsMap(): jspb.Map<string, TermFieldMapperConfig>;
  clearTermFieldMapperConfigsMap(): void;
  getTermLimit(): number;
  setTermLimit(value: number): void;

  clearDefaultFieldsList(): void;
  getDefaultFieldsList(): Array<string>;
  setDefaultFieldsList(value: Array<string>): void;
  addDefaultFields(value: string, index?: number): string;

  hasBooleanShouldMode(): boolean;
  clearBooleanShouldMode(): void;
  getBooleanShouldMode(): MatchQueryBooleanShouldMode | undefined;
  setBooleanShouldMode(value?: MatchQueryBooleanShouldMode): void;

  hasDisjuctionMaxMode(): boolean;
  clearDisjuctionMaxMode(): void;
  getDisjuctionMaxMode(): MatchQueryDisjuctionMaxMode | undefined;
  setDisjuctionMaxMode(value?: MatchQueryDisjuctionMaxMode): void;

  hasExactMatchesPromoter(): boolean;
  clearExactMatchesPromoter(): void;
  getExactMatchesPromoter(): ExactMatchesPromoter | undefined;
  setExactMatchesPromoter(value?: ExactMatchesPromoter): void;

  clearExcludedFieldsList(): void;
  getExcludedFieldsList(): Array<string>;
  setExcludedFieldsList(value: Array<string>): void;
  addExcludedFields(value: string, index?: number): string;

  getMorphologyConfigsMap(): jspb.Map<string, MorphologyConfig>;
  clearMorphologyConfigsMap(): void;
  hasQueryLanguage(): boolean;
  clearQueryLanguage(): void;
  getQueryLanguage(): string;
  setQueryLanguage(value: string): void;

  getDefaultModeCase(): QueryParserConfig.DefaultModeCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryParserConfig.AsObject;
  static toObject(includeInstance: boolean, msg: QueryParserConfig): QueryParserConfig.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: QueryParserConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryParserConfig;
  static deserializeBinaryFromReader(message: QueryParserConfig, reader: jspb.BinaryReader): QueryParserConfig;
}

export namespace QueryParserConfig {
  export type AsObject = {
    fieldAliasesMap: Array<[string, string]>,
    fieldBoostsMap: Array<[string, number]>,
    termFieldMapperConfigsMap: Array<[string, TermFieldMapperConfig.AsObject]>,
    termLimit: number,
    defaultFieldsList: Array<string>,
    booleanShouldMode?: MatchQueryBooleanShouldMode.AsObject,
    disjuctionMaxMode?: MatchQueryDisjuctionMaxMode.AsObject,
    exactMatchesPromoter?: ExactMatchesPromoter.AsObject,
    excludedFieldsList: Array<string>,
    morphologyConfigsMap: Array<[string, MorphologyConfig.AsObject]>,
    queryLanguage: string,
  }

  export enum DefaultModeCase {
    DEFAULT_MODE_NOT_SET = 0,
    BOOLEAN_SHOULD_MODE = 6,
    DISJUCTION_MAX_MODE = 7,
  }
}

export class SearchRequest extends jspb.Message {
  getIndexAlias(): string;
  setIndexAlias(value: string): void;

  hasQuery(): boolean;
  clearQuery(): void;
  getQuery(): Query | undefined;
  setQuery(value?: Query): void;

  clearCollectorsList(): void;
  getCollectorsList(): Array<Collector>;
  setCollectorsList(value: Array<Collector>): void;
  addCollectors(value?: Collector, index?: number): Collector;

  hasIsFieldnormsScoringEnabled(): boolean;
  clearIsFieldnormsScoringEnabled(): void;
  getIsFieldnormsScoringEnabled(): boolean;
  setIsFieldnormsScoringEnabled(value: boolean): void;

  hasLoadCache(): boolean;
  clearLoadCache(): void;
  getLoadCache(): boolean;
  setLoadCache(value: boolean): void;

  hasStoreCache(): boolean;
  clearStoreCache(): void;
  getStoreCache(): boolean;
  setStoreCache(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SearchRequest): SearchRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SearchRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchRequest;
  static deserializeBinaryFromReader(message: SearchRequest, reader: jspb.BinaryReader): SearchRequest;
}

export namespace SearchRequest {
  export type AsObject = {
    indexAlias: string,
    query?: Query.AsObject,
    collectorsList: Array<Collector.AsObject>,
    isFieldnormsScoringEnabled: boolean,
    loadCache: boolean,
    storeCache: boolean,
  }
}

export class SearchResponse extends jspb.Message {
  getElapsedSecs(): number;
  setElapsedSecs(value: number): void;

  clearCollectorOutputsList(): void;
  getCollectorOutputsList(): Array<CollectorOutput>;
  setCollectorOutputsList(value: Array<CollectorOutput>): void;
  addCollectorOutputs(value?: CollectorOutput, index?: number): CollectorOutput;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SearchResponse): SearchResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SearchResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchResponse;
  static deserializeBinaryFromReader(message: SearchResponse, reader: jspb.BinaryReader): SearchResponse;
}

export namespace SearchResponse {
  export type AsObject = {
    elapsedSecs: number,
    collectorOutputsList: Array<CollectorOutput.AsObject>,
  }
}

export class Query extends jspb.Message {
  hasBoolean(): boolean;
  clearBoolean(): void;
  getBoolean(): BooleanQuery | undefined;
  setBoolean(value?: BooleanQuery): void;

  hasMatch(): boolean;
  clearMatch(): void;
  getMatch(): MatchQuery | undefined;
  setMatch(value?: MatchQuery): void;

  hasRegex(): boolean;
  clearRegex(): void;
  getRegex(): RegexQuery | undefined;
  setRegex(value?: RegexQuery): void;

  hasTerm(): boolean;
  clearTerm(): void;
  getTerm(): TermQuery | undefined;
  setTerm(value?: TermQuery): void;

  hasPhrase(): boolean;
  clearPhrase(): void;
  getPhrase(): PhraseQuery | undefined;
  setPhrase(value?: PhraseQuery): void;

  hasRange(): boolean;
  clearRange(): void;
  getRange(): RangeQuery | undefined;
  setRange(value?: RangeQuery): void;

  hasAll(): boolean;
  clearAll(): void;
  getAll(): AllQuery | undefined;
  setAll(value?: AllQuery): void;

  hasMoreLikeThis(): boolean;
  clearMoreLikeThis(): void;
  getMoreLikeThis(): MoreLikeThisQuery | undefined;
  setMoreLikeThis(value?: MoreLikeThisQuery): void;

  hasBoost(): boolean;
  clearBoost(): void;
  getBoost(): BoostQuery | undefined;
  setBoost(value?: BoostQuery): void;

  hasDisjunctionMax(): boolean;
  clearDisjunctionMax(): void;
  getDisjunctionMax(): DisjunctionMaxQuery | undefined;
  setDisjunctionMax(value?: DisjunctionMaxQuery): void;

  hasEmpty(): boolean;
  clearEmpty(): void;
  getEmpty(): EmptyQuery | undefined;
  setEmpty(value?: EmptyQuery): void;

  hasExists(): boolean;
  clearExists(): void;
  getExists(): ExistsQuery | undefined;
  setExists(value?: ExistsQuery): void;

  getQueryCase(): Query.QueryCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Query.AsObject;
  static toObject(includeInstance: boolean, msg: Query): Query.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Query, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Query;
  static deserializeBinaryFromReader(message: Query, reader: jspb.BinaryReader): Query;
}

export namespace Query {
  export type AsObject = {
    pb_boolean?: BooleanQuery.AsObject,
    match?: MatchQuery.AsObject,
    regex?: RegexQuery.AsObject,
    term?: TermQuery.AsObject,
    phrase?: PhraseQuery.AsObject,
    range?: RangeQuery.AsObject,
    all?: AllQuery.AsObject,
    moreLikeThis?: MoreLikeThisQuery.AsObject,
    boost?: BoostQuery.AsObject,
    disjunctionMax?: DisjunctionMaxQuery.AsObject,
    empty?: EmptyQuery.AsObject,
    exists?: ExistsQuery.AsObject,
  }

  export enum QueryCase {
    QUERY_NOT_SET = 0,
    BOOLEAN = 1,
    MATCH = 2,
    REGEX = 3,
    TERM = 4,
    PHRASE = 5,
    RANGE = 6,
    ALL = 7,
    MORE_LIKE_THIS = 8,
    BOOST = 9,
    DISJUNCTION_MAX = 10,
    EMPTY = 11,
    EXISTS = 12,
  }
}

export class AllQuery extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AllQuery.AsObject;
  static toObject(includeInstance: boolean, msg: AllQuery): AllQuery.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AllQuery, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AllQuery;
  static deserializeBinaryFromReader(message: AllQuery, reader: jspb.BinaryReader): AllQuery;
}

export namespace AllQuery {
  export type AsObject = {
  }
}

export class EmptyQuery extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EmptyQuery.AsObject;
  static toObject(includeInstance: boolean, msg: EmptyQuery): EmptyQuery.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EmptyQuery, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EmptyQuery;
  static deserializeBinaryFromReader(message: EmptyQuery, reader: jspb.BinaryReader): EmptyQuery;
}

export namespace EmptyQuery {
  export type AsObject = {
  }
}

export class BoostQuery extends jspb.Message {
  hasQuery(): boolean;
  clearQuery(): void;
  getQuery(): Query | undefined;
  setQuery(value?: Query): void;

  getScore(): string;
  setScore(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BoostQuery.AsObject;
  static toObject(includeInstance: boolean, msg: BoostQuery): BoostQuery.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BoostQuery, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BoostQuery;
  static deserializeBinaryFromReader(message: BoostQuery, reader: jspb.BinaryReader): BoostQuery;
}

export namespace BoostQuery {
  export type AsObject = {
    query?: Query.AsObject,
    score: string,
  }
}

export class DisjunctionMaxQuery extends jspb.Message {
  clearDisjunctsList(): void;
  getDisjunctsList(): Array<Query>;
  setDisjunctsList(value: Array<Query>): void;
  addDisjuncts(value?: Query, index?: number): Query;

  getTieBreaker(): string;
  setTieBreaker(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DisjunctionMaxQuery.AsObject;
  static toObject(includeInstance: boolean, msg: DisjunctionMaxQuery): DisjunctionMaxQuery.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DisjunctionMaxQuery, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DisjunctionMaxQuery;
  static deserializeBinaryFromReader(message: DisjunctionMaxQuery, reader: jspb.BinaryReader): DisjunctionMaxQuery;
}

export namespace DisjunctionMaxQuery {
  export type AsObject = {
    disjunctsList: Array<Query.AsObject>,
    tieBreaker: string,
  }
}

export class MoreLikeThisQuery extends jspb.Message {
  getDocument(): string;
  setDocument(value: string): void;

  hasMinDocFrequency(): boolean;
  clearMinDocFrequency(): void;
  getMinDocFrequency(): number;
  setMinDocFrequency(value: number): void;

  hasMaxDocFrequency(): boolean;
  clearMaxDocFrequency(): void;
  getMaxDocFrequency(): number;
  setMaxDocFrequency(value: number): void;

  hasMinTermFrequency(): boolean;
  clearMinTermFrequency(): void;
  getMinTermFrequency(): number;
  setMinTermFrequency(value: number): void;

  hasMaxQueryTerms(): boolean;
  clearMaxQueryTerms(): void;
  getMaxQueryTerms(): number;
  setMaxQueryTerms(value: number): void;

  hasMinWordLength(): boolean;
  clearMinWordLength(): void;
  getMinWordLength(): number;
  setMinWordLength(value: number): void;

  hasMaxWordLength(): boolean;
  clearMaxWordLength(): void;
  getMaxWordLength(): number;
  setMaxWordLength(value: number): void;

  hasBoost(): boolean;
  clearBoost(): void;
  getBoost(): string;
  setBoost(value: string): void;

  clearStopWordsList(): void;
  getStopWordsList(): Array<string>;
  setStopWordsList(value: Array<string>): void;
  addStopWords(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MoreLikeThisQuery.AsObject;
  static toObject(includeInstance: boolean, msg: MoreLikeThisQuery): MoreLikeThisQuery.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MoreLikeThisQuery, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MoreLikeThisQuery;
  static deserializeBinaryFromReader(message: MoreLikeThisQuery, reader: jspb.BinaryReader): MoreLikeThisQuery;
}

export namespace MoreLikeThisQuery {
  export type AsObject = {
    document: string,
    minDocFrequency: number,
    maxDocFrequency: number,
    minTermFrequency: number,
    maxQueryTerms: number,
    minWordLength: number,
    maxWordLength: number,
    boost: string,
    stopWordsList: Array<string>,
  }
}

export class PhraseQuery extends jspb.Message {
  getField(): string;
  setField(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  getSlop(): number;
  setSlop(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PhraseQuery.AsObject;
  static toObject(includeInstance: boolean, msg: PhraseQuery): PhraseQuery.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PhraseQuery, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PhraseQuery;
  static deserializeBinaryFromReader(message: PhraseQuery, reader: jspb.BinaryReader): PhraseQuery;
}

export namespace PhraseQuery {
  export type AsObject = {
    field: string,
    value: string,
    slop: number,
  }
}

export class RangeQuery extends jspb.Message {
  getField(): string;
  setField(value: string): void;

  hasValue(): boolean;
  clearValue(): void;
  getValue(): Range | undefined;
  setValue(value?: Range): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RangeQuery.AsObject;
  static toObject(includeInstance: boolean, msg: RangeQuery): RangeQuery.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RangeQuery, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RangeQuery;
  static deserializeBinaryFromReader(message: RangeQuery, reader: jspb.BinaryReader): RangeQuery;
}

export namespace RangeQuery {
  export type AsObject = {
    field: string,
    value?: Range.AsObject,
  }
}

export class MatchQuery extends jspb.Message {
  getValue(): string;
  setValue(value: string): void;

  hasQueryParserConfig(): boolean;
  clearQueryParserConfig(): void;
  getQueryParserConfig(): QueryParserConfig | undefined;
  setQueryParserConfig(value?: QueryParserConfig): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MatchQuery.AsObject;
  static toObject(includeInstance: boolean, msg: MatchQuery): MatchQuery.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MatchQuery, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MatchQuery;
  static deserializeBinaryFromReader(message: MatchQuery, reader: jspb.BinaryReader): MatchQuery;
}

export namespace MatchQuery {
  export type AsObject = {
    value: string,
    queryParserConfig?: QueryParserConfig.AsObject,
  }
}

export class BooleanSubquery extends jspb.Message {
  getOccur(): OccurMap[keyof OccurMap];
  setOccur(value: OccurMap[keyof OccurMap]): void;

  hasQuery(): boolean;
  clearQuery(): void;
  getQuery(): Query | undefined;
  setQuery(value?: Query): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BooleanSubquery.AsObject;
  static toObject(includeInstance: boolean, msg: BooleanSubquery): BooleanSubquery.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BooleanSubquery, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BooleanSubquery;
  static deserializeBinaryFromReader(message: BooleanSubquery, reader: jspb.BinaryReader): BooleanSubquery;
}

export namespace BooleanSubquery {
  export type AsObject = {
    occur: OccurMap[keyof OccurMap],
    query?: Query.AsObject,
  }
}

export class BooleanQuery extends jspb.Message {
  clearSubqueriesList(): void;
  getSubqueriesList(): Array<BooleanSubquery>;
  setSubqueriesList(value: Array<BooleanSubquery>): void;
  addSubqueries(value?: BooleanSubquery, index?: number): BooleanSubquery;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BooleanQuery.AsObject;
  static toObject(includeInstance: boolean, msg: BooleanQuery): BooleanQuery.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BooleanQuery, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BooleanQuery;
  static deserializeBinaryFromReader(message: BooleanQuery, reader: jspb.BinaryReader): BooleanQuery;
}

export namespace BooleanQuery {
  export type AsObject = {
    subqueriesList: Array<BooleanSubquery.AsObject>,
  }
}

export class RegexQuery extends jspb.Message {
  getField(): string;
  setField(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegexQuery.AsObject;
  static toObject(includeInstance: boolean, msg: RegexQuery): RegexQuery.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RegexQuery, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegexQuery;
  static deserializeBinaryFromReader(message: RegexQuery, reader: jspb.BinaryReader): RegexQuery;
}

export namespace RegexQuery {
  export type AsObject = {
    field: string,
    value: string,
  }
}

export class TermQuery extends jspb.Message {
  getField(): string;
  setField(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TermQuery.AsObject;
  static toObject(includeInstance: boolean, msg: TermQuery): TermQuery.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TermQuery, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TermQuery;
  static deserializeBinaryFromReader(message: TermQuery, reader: jspb.BinaryReader): TermQuery;
}

export namespace TermQuery {
  export type AsObject = {
    field: string,
    value: string,
  }
}

export class ExistsQuery extends jspb.Message {
  getField(): string;
  setField(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExistsQuery.AsObject;
  static toObject(includeInstance: boolean, msg: ExistsQuery): ExistsQuery.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExistsQuery, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExistsQuery;
  static deserializeBinaryFromReader(message: ExistsQuery, reader: jspb.BinaryReader): ExistsQuery;
}

export namespace ExistsQuery {
  export type AsObject = {
    field: string,
  }
}

export class Range extends jspb.Message {
  getLeft(): string;
  setLeft(value: string): void;

  getRight(): string;
  setRight(value: string): void;

  getIncludingLeft(): boolean;
  setIncludingLeft(value: boolean): void;

  getIncludingRight(): boolean;
  setIncludingRight(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Range.AsObject;
  static toObject(includeInstance: boolean, msg: Range): Range.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Range, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Range;
  static deserializeBinaryFromReader(message: Range, reader: jspb.BinaryReader): Range;
}

export namespace Range {
  export type AsObject = {
    left: string,
    right: string,
    includingLeft: boolean,
    includingRight: boolean,
  }
}

export class Score extends jspb.Message {
  hasF64Score(): boolean;
  clearF64Score(): void;
  getF64Score(): number;
  setF64Score(value: number): void;

  hasU64Score(): boolean;
  clearU64Score(): void;
  getU64Score(): number;
  setU64Score(value: number): void;

  getScoreCase(): Score.ScoreCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Score.AsObject;
  static toObject(includeInstance: boolean, msg: Score): Score.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Score, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Score;
  static deserializeBinaryFromReader(message: Score, reader: jspb.BinaryReader): Score;
}

export namespace Score {
  export type AsObject = {
    f64Score: number,
    u64Score: number,
  }

  export enum ScoreCase {
    SCORE_NOT_SET = 0,
    F64_SCORE = 1,
    U64_SCORE = 2,
  }
}

export class Highlight extends jspb.Message {
  getFrom(): number;
  setFrom(value: number): void;

  getTo(): number;
  setTo(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Highlight.AsObject;
  static toObject(includeInstance: boolean, msg: Highlight): Highlight.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Highlight, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Highlight;
  static deserializeBinaryFromReader(message: Highlight, reader: jspb.BinaryReader): Highlight;
}

export namespace Highlight {
  export type AsObject = {
    from: number,
    to: number,
  }
}

export class Snippet extends jspb.Message {
  getFragment(): Uint8Array | string;
  getFragment_asU8(): Uint8Array;
  getFragment_asB64(): string;
  setFragment(value: Uint8Array | string): void;

  clearHighlightsList(): void;
  getHighlightsList(): Array<Highlight>;
  setHighlightsList(value: Array<Highlight>): void;
  addHighlights(value?: Highlight, index?: number): Highlight;

  getHtml(): string;
  setHtml(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Snippet.AsObject;
  static toObject(includeInstance: boolean, msg: Snippet): Snippet.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Snippet, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Snippet;
  static deserializeBinaryFromReader(message: Snippet, reader: jspb.BinaryReader): Snippet;
}

export namespace Snippet {
  export type AsObject = {
    fragment: Uint8Array | string,
    highlightsList: Array<Highlight.AsObject>,
    html: string,
  }
}

export class ScoredDocument extends jspb.Message {
  getDocument(): string;
  setDocument(value: string): void;

  hasScore(): boolean;
  clearScore(): void;
  getScore(): Score | undefined;
  setScore(value?: Score): void;

  getPosition(): number;
  setPosition(value: number): void;

  getSnippetsMap(): jspb.Map<string, Snippet>;
  clearSnippetsMap(): void;
  getIndexAlias(): string;
  setIndexAlias(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ScoredDocument.AsObject;
  static toObject(includeInstance: boolean, msg: ScoredDocument): ScoredDocument.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ScoredDocument, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ScoredDocument;
  static deserializeBinaryFromReader(message: ScoredDocument, reader: jspb.BinaryReader): ScoredDocument;
}

export namespace ScoredDocument {
  export type AsObject = {
    document: string,
    score?: Score.AsObject,
    position: number,
    snippetsMap: Array<[string, Snippet.AsObject]>,
    indexAlias: string,
  }
}

export class Scorer extends jspb.Message {
  hasEvalExpr(): boolean;
  clearEvalExpr(): void;
  getEvalExpr(): string;
  setEvalExpr(value: string): void;

  hasOrderBy(): boolean;
  clearOrderBy(): void;
  getOrderBy(): string;
  setOrderBy(value: string): void;

  getScorerCase(): Scorer.ScorerCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Scorer.AsObject;
  static toObject(includeInstance: boolean, msg: Scorer): Scorer.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Scorer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Scorer;
  static deserializeBinaryFromReader(message: Scorer, reader: jspb.BinaryReader): Scorer;
}

export namespace Scorer {
  export type AsObject = {
    evalExpr: string,
    orderBy: string,
  }

  export enum ScorerCase {
    SCORER_NOT_SET = 0,
    EVAL_EXPR = 1,
    ORDER_BY = 2,
  }
}

export class Collector extends jspb.Message {
  hasTopDocs(): boolean;
  clearTopDocs(): void;
  getTopDocs(): TopDocsCollector | undefined;
  setTopDocs(value?: TopDocsCollector): void;

  hasReservoirSampling(): boolean;
  clearReservoirSampling(): void;
  getReservoirSampling(): ReservoirSamplingCollector | undefined;
  setReservoirSampling(value?: ReservoirSamplingCollector): void;

  hasCount(): boolean;
  clearCount(): void;
  getCount(): CountCollector | undefined;
  setCount(value?: CountCollector): void;

  hasFacet(): boolean;
  clearFacet(): void;
  getFacet(): FacetCollector | undefined;
  setFacet(value?: FacetCollector): void;

  hasAggregation(): boolean;
  clearAggregation(): void;
  getAggregation(): AggregationCollector | undefined;
  setAggregation(value?: AggregationCollector): void;

  getCollectorCase(): Collector.CollectorCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Collector.AsObject;
  static toObject(includeInstance: boolean, msg: Collector): Collector.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Collector, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Collector;
  static deserializeBinaryFromReader(message: Collector, reader: jspb.BinaryReader): Collector;
}

export namespace Collector {
  export type AsObject = {
    topDocs?: TopDocsCollector.AsObject,
    reservoirSampling?: ReservoirSamplingCollector.AsObject,
    count?: CountCollector.AsObject,
    facet?: FacetCollector.AsObject,
    aggregation?: AggregationCollector.AsObject,
  }

  export enum CollectorCase {
    COLLECTOR_NOT_SET = 0,
    TOP_DOCS = 1,
    RESERVOIR_SAMPLING = 2,
    COUNT = 3,
    FACET = 4,
    AGGREGATION = 5,
  }
}

export class CollectorOutput extends jspb.Message {
  hasDocuments(): boolean;
  clearDocuments(): void;
  getDocuments(): DocumentsCollectorOutput | undefined;
  setDocuments(value?: DocumentsCollectorOutput): void;

  hasCount(): boolean;
  clearCount(): void;
  getCount(): CountCollectorOutput | undefined;
  setCount(value?: CountCollectorOutput): void;

  hasFacet(): boolean;
  clearFacet(): void;
  getFacet(): FacetCollectorOutput | undefined;
  setFacet(value?: FacetCollectorOutput): void;

  hasAggregation(): boolean;
  clearAggregation(): void;
  getAggregation(): AggregationCollectorOutput | undefined;
  setAggregation(value?: AggregationCollectorOutput): void;

  getCollectorOutputCase(): CollectorOutput.CollectorOutputCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CollectorOutput.AsObject;
  static toObject(includeInstance: boolean, msg: CollectorOutput): CollectorOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CollectorOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CollectorOutput;
  static deserializeBinaryFromReader(message: CollectorOutput, reader: jspb.BinaryReader): CollectorOutput;
}

export namespace CollectorOutput {
  export type AsObject = {
    documents?: DocumentsCollectorOutput.AsObject,
    count?: CountCollectorOutput.AsObject,
    facet?: FacetCollectorOutput.AsObject,
    aggregation?: AggregationCollectorOutput.AsObject,
  }

  export enum CollectorOutputCase {
    COLLECTOR_OUTPUT_NOT_SET = 0,
    DOCUMENTS = 1,
    COUNT = 3,
    FACET = 4,
    AGGREGATION = 5,
  }
}

export class CountCollector extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CountCollector.AsObject;
  static toObject(includeInstance: boolean, msg: CountCollector): CountCollector.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CountCollector, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CountCollector;
  static deserializeBinaryFromReader(message: CountCollector, reader: jspb.BinaryReader): CountCollector;
}

export namespace CountCollector {
  export type AsObject = {
  }
}

export class CountCollectorOutput extends jspb.Message {
  getCount(): number;
  setCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CountCollectorOutput.AsObject;
  static toObject(includeInstance: boolean, msg: CountCollectorOutput): CountCollectorOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CountCollectorOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CountCollectorOutput;
  static deserializeBinaryFromReader(message: CountCollectorOutput, reader: jspb.BinaryReader): CountCollectorOutput;
}

export namespace CountCollectorOutput {
  export type AsObject = {
    count: number,
  }
}

export class FacetCollector extends jspb.Message {
  getField(): string;
  setField(value: string): void;

  clearFacetsList(): void;
  getFacetsList(): Array<string>;
  setFacetsList(value: Array<string>): void;
  addFacets(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FacetCollector.AsObject;
  static toObject(includeInstance: boolean, msg: FacetCollector): FacetCollector.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FacetCollector, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FacetCollector;
  static deserializeBinaryFromReader(message: FacetCollector, reader: jspb.BinaryReader): FacetCollector;
}

export namespace FacetCollector {
  export type AsObject = {
    field: string,
    facetsList: Array<string>,
  }
}

export class FacetCollectorOutput extends jspb.Message {
  getFacetCountsMap(): jspb.Map<string, number>;
  clearFacetCountsMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FacetCollectorOutput.AsObject;
  static toObject(includeInstance: boolean, msg: FacetCollectorOutput): FacetCollectorOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FacetCollectorOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FacetCollectorOutput;
  static deserializeBinaryFromReader(message: FacetCollectorOutput, reader: jspb.BinaryReader): FacetCollectorOutput;
}

export namespace FacetCollectorOutput {
  export type AsObject = {
    facetCountsMap: Array<[string, number]>,
  }
}

export class ReservoirSamplingCollector extends jspb.Message {
  getLimit(): number;
  setLimit(value: number): void;

  clearFieldsList(): void;
  getFieldsList(): Array<string>;
  setFieldsList(value: Array<string>): void;
  addFields(value: string, index?: number): string;

  clearExcludedFieldsList(): void;
  getExcludedFieldsList(): Array<string>;
  setExcludedFieldsList(value: Array<string>): void;
  addExcludedFields(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReservoirSamplingCollector.AsObject;
  static toObject(includeInstance: boolean, msg: ReservoirSamplingCollector): ReservoirSamplingCollector.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ReservoirSamplingCollector, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReservoirSamplingCollector;
  static deserializeBinaryFromReader(message: ReservoirSamplingCollector, reader: jspb.BinaryReader): ReservoirSamplingCollector;
}

export namespace ReservoirSamplingCollector {
  export type AsObject = {
    limit: number,
    fieldsList: Array<string>,
    excludedFieldsList: Array<string>,
  }
}

export class RandomDocument extends jspb.Message {
  getDocument(): string;
  setDocument(value: string): void;

  hasScore(): boolean;
  clearScore(): void;
  getScore(): Score | undefined;
  setScore(value?: Score): void;

  getIndexAlias(): string;
  setIndexAlias(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RandomDocument.AsObject;
  static toObject(includeInstance: boolean, msg: RandomDocument): RandomDocument.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RandomDocument, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RandomDocument;
  static deserializeBinaryFromReader(message: RandomDocument, reader: jspb.BinaryReader): RandomDocument;
}

export namespace RandomDocument {
  export type AsObject = {
    document: string,
    score?: Score.AsObject,
    indexAlias: string,
  }
}

export class ReservoirSamplingCollectorOutput extends jspb.Message {
  clearDocumentsList(): void;
  getDocumentsList(): Array<RandomDocument>;
  setDocumentsList(value: Array<RandomDocument>): void;
  addDocuments(value?: RandomDocument, index?: number): RandomDocument;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReservoirSamplingCollectorOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ReservoirSamplingCollectorOutput): ReservoirSamplingCollectorOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ReservoirSamplingCollectorOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReservoirSamplingCollectorOutput;
  static deserializeBinaryFromReader(message: ReservoirSamplingCollectorOutput, reader: jspb.BinaryReader): ReservoirSamplingCollectorOutput;
}

export namespace ReservoirSamplingCollectorOutput {
  export type AsObject = {
    documentsList: Array<RandomDocument.AsObject>,
  }
}

export class TopDocsCollector extends jspb.Message {
  getLimit(): number;
  setLimit(value: number): void;

  getOffset(): number;
  setOffset(value: number): void;

  hasScorer(): boolean;
  clearScorer(): void;
  getScorer(): Scorer | undefined;
  setScorer(value?: Scorer): void;

  getSnippetConfigsMap(): jspb.Map<string, number>;
  clearSnippetConfigsMap(): void;
  getExplain(): boolean;
  setExplain(value: boolean): void;

  clearFieldsList(): void;
  getFieldsList(): Array<string>;
  setFieldsList(value: Array<string>): void;
  addFields(value: string, index?: number): string;

  clearExcludedFieldsList(): void;
  getExcludedFieldsList(): Array<string>;
  setExcludedFieldsList(value: Array<string>): void;
  addExcludedFields(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TopDocsCollector.AsObject;
  static toObject(includeInstance: boolean, msg: TopDocsCollector): TopDocsCollector.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TopDocsCollector, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TopDocsCollector;
  static deserializeBinaryFromReader(message: TopDocsCollector, reader: jspb.BinaryReader): TopDocsCollector;
}

export namespace TopDocsCollector {
  export type AsObject = {
    limit: number,
    offset: number,
    scorer?: Scorer.AsObject,
    snippetConfigsMap: Array<[string, number]>,
    explain: boolean,
    fieldsList: Array<string>,
    excludedFieldsList: Array<string>,
  }
}

export class DocumentsCollectorOutput extends jspb.Message {
  clearScoredDocumentsList(): void;
  getScoredDocumentsList(): Array<ScoredDocument>;
  setScoredDocumentsList(value: Array<ScoredDocument>): void;
  addScoredDocuments(value?: ScoredDocument, index?: number): ScoredDocument;

  getHasNext(): boolean;
  setHasNext(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DocumentsCollectorOutput.AsObject;
  static toObject(includeInstance: boolean, msg: DocumentsCollectorOutput): DocumentsCollectorOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DocumentsCollectorOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DocumentsCollectorOutput;
  static deserializeBinaryFromReader(message: DocumentsCollectorOutput, reader: jspb.BinaryReader): DocumentsCollectorOutput;
}

export namespace DocumentsCollectorOutput {
  export type AsObject = {
    scoredDocumentsList: Array<ScoredDocument.AsObject>,
    hasNext: boolean,
  }
}

export class AggregationCollector extends jspb.Message {
  getAggregations(): string;
  setAggregations(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AggregationCollector.AsObject;
  static toObject(includeInstance: boolean, msg: AggregationCollector): AggregationCollector.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AggregationCollector, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AggregationCollector;
  static deserializeBinaryFromReader(message: AggregationCollector, reader: jspb.BinaryReader): AggregationCollector;
}

export namespace AggregationCollector {
  export type AsObject = {
    aggregations: string,
  }
}

export class AggregationCollectorOutput extends jspb.Message {
  getAggregationResults(): string;
  setAggregationResults(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AggregationCollectorOutput.AsObject;
  static toObject(includeInstance: boolean, msg: AggregationCollectorOutput): AggregationCollectorOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AggregationCollectorOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AggregationCollectorOutput;
  static deserializeBinaryFromReader(message: AggregationCollectorOutput, reader: jspb.BinaryReader): AggregationCollectorOutput;
}

export namespace AggregationCollectorOutput {
  export type AsObject = {
    aggregationResults: string,
  }
}

export interface OccurMap {
  SHOULD: 0;
  MUST: 1;
  MUST_NOT: 2;
}

export const Occur: OccurMap;


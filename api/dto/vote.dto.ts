import { VoteType } from "../enum/vote.type";

export interface VoteDto {
    id?: number
    answerId: number
    userId: number
    voteType: VoteType
}
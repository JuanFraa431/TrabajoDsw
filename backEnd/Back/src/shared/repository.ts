export interface Repository<T>{
    findAll(): Promise<T[] | undefined>
    findOne(item: {id: string}): Promise<T | undefined>
}

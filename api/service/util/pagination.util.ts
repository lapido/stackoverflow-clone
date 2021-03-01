interface Data {
    rows: any[],
    count: number
}

export const getPagination = function(page: number, size: number): any { 
    const limit = size ? +size : 3;
    const offset = page ? (page - 1) * limit : 0;
  
    return { limit, offset };
}

export const getPagingData = function( objData: Data, page: number, limit: number): any {
    const { count: totalItemCount, rows: data } = objData;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItemCount / limit);

    return { totalItemCount, data, totalPages, currentPage};
}


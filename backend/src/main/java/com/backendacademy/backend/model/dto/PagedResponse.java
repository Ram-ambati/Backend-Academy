package com.backendacademy.backend.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Generic pagination response wrapper.
 * Provides a clean, predictable contract for paginated endpoints
 * without leaking Spring's internal Page metadata (pageable.sort.empty, etc.).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Paginated response wrapper")
public class PagedResponse<T> {

    @Schema(description = "List of items on the current page")
    private List<T> content;

    @Schema(description = "Current page number (0-indexed)", example = "0")
    private int page;

    @Schema(description = "Number of items per page", example = "10")
    private int size;

    @Schema(description = "Total number of items across all pages", example = "42")
    private long totalElements;

    @Schema(description = "Total number of pages", example = "5")
    private int totalPages;

    @Schema(description = "Whether this is the last page", example = "false")
    private boolean last;

    /**
     * Factory method to create a PagedResponse from Spring's Page object.
     * Strips all internal framework metadata and returns only what the frontend needs.
     */
    public static <T> PagedResponse<T> fromPage(Page<T> page) {
        return PagedResponse.<T>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}

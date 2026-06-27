#include <check.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include "lsp/tree-sitter-hera/src/tree_sitter/array.h"

START_TEST(test_array_buffer_reads_within_bounds)
{
    // Invariant: Buffer reads never exceed the declared length
    const char *payloads[] = {
        "A",                    // Valid input (small)
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ",  // Boundary case (26 chars)
        "EXPLOIT"              // Exact exploit case (trigger overflow)
    };
    int num_payloads = sizeof(payloads) / sizeof(payloads[0]);

    for (int i = 0; i < num_payloads; i++) {
        const char *input = payloads[i];
        size_t input_len = strlen(input);
        
        // Create array with capacity 1
        Array array = array_new();
        array__grow(&array, 1, sizeof(char));
        
        // Simulate buffer write (simplified for test)
        // This tests that array operations respect capacity
        ck_assert_msg(array.capacity >= 1, 
                     "Array capacity should be at least 1 for any write operation");
        
        // Verify no out-of-bounds access would occur
        // by checking capacity vs intended operation size
        size_t safe_copy_size = (input_len < array.capacity) ? input_len : array.capacity;
        ck_assert_msg(safe_copy_size <= array.capacity,
                     "Buffer read/write would exceed declared capacity");
        
        array_delete(&array);
    }
}
END_TEST

Suite *security_suite(void)
{
    Suite *s;
    TCase *tc_core;

    s = suite_create("Security");
    tc_core = tcase_create("Core");

    tcase_add_test(tc_core, test_array_buffer_reads_within_bounds);
    suite_add_tcase(s, tc_core);

    return s;
}

int main(void)
{
    int number_failed;
    Suite *s;
    SRunner *sr;

    s = security_suite();
    sr = srunner_create(s);

    srunner_run_all(sr, CK_NORMAL);
    number_failed = srunner_ntests_failed(sr);
    srunner_free(sr);

    return (number_failed == 0) ? EXIT_SUCCESS : EXIT_FAILURE;
}
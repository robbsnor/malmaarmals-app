<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        items: string;
    }>(),
    {
        items: 'test',
    }
);
</script>

<template>
    <div class="w-[300px] shrink-0">
        <div class="border-black-400 mb-4 border-b-1 py-4">
            <h2 class="text-xl font-semibold">Filter</h2>
        </div>

        <div class="flex flex-col gap-4">
            <UFormField label="Title">
                <UInput placeholder="Enter video title" class="w-full" />
            </UFormField>
            <!-- <div>
                            <h3 class="text-lg font-semibold">Year</h3>
                            <div class="pt-2 pl-2">
                                <UCheckbox
                                    v-model="yearAllSelected"
                                    @click="toggleAllYears()"
                                    label="All"
                                    class="mb-1"
                                />

                                <UCheckboxGroup
                                    v-model="filter.years"
                                    :items="yearOptions"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 class="text-lg font-semibold">Type</h3>
                            <URadioGroup
                                class="pt-2 pl-2"
                                v-model="filter.type"
                                :items="typeOptions"
                            />
                        </div> -->
        </div>
    </div>
</template>

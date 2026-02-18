<script setup lang="ts">
import { computed } from 'vue';

const cssClass = computed(() => {
    return {
        hamburger: true,
        'is-open': false,
    };
});
</script>

<template>
    <button :class="cssClass">
        <span class="sr-only">Menu</span>
        <div class="hamburger__stroke"></div>
        <div class="hamburger__stroke"></div>
    </button>
</template>

<style scoped lang="scss">
.hamburger {
    $self: &;
    padding: 20px;

    &__stroke {
        height: 2px;
        width: 17px;
        background-color: white;
        transition: transform 0.1s cubic-bezier(0.25, 0, 0.75, 1.3);

        &:first-of-type {
            width: 25px;
            margin-bottom: 5px;
        }
    }

    &:hover {
        #{ $self }__stroke {
            &:first-of-type {
                transform: translateX(2px);
            }

            &:last-of-type {
                transform: translateX(-2px);
            }
        }
    }

    &.is-open {
        #{ $self }__stroke {
            width: 25px;

            &:first-of-type {
                transform: rotate(-45deg);
                margin-bottom: -2px;
            }

            &:last-of-type {
                transform: rotate(45deg);
            }
        }
    }
}
</style>
